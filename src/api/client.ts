import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { tokenUtils } from '../utils/token';
import type { RefreshResponse } from './types/auth';

const client = axios.create({
  baseURL: 'https://lbbj5pioquwxdexqmcnwaxrpce0lcoqx.lambda-url.ap-southeast-1.on.aws',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Access Token
client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenUtils.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Variables for managing concurrent refreshes
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor: Handle 401 and Refresh Token
client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // if error is 401 and it's not a retry request
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      
      // Prevent infinite loop if the refresh token call itself returns 401
      if (originalRequest.url?.includes('/auth/refresh') || originalRequest.url?.includes('/auth')) {
        tokenUtils.clearAllTokens();
        return Promise.reject(error);
      }

      const refreshToken = tokenUtils.getRefreshToken();
      if (!refreshToken) {
        tokenUtils.clearAllTokens();
        // Here you might want to redirect to login or dispatch an event
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue the request until refresh is done
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return client(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh token
        // We use a new axios instance or simple fetch to avoid interceptors loops
        const response = await axios.post<RefreshResponse>(
          'https://lbbj5pioquwxdexqmcnwaxrpce0lcoqx.lambda-url.ap-southeast-1.on.aws/auth/refresh',
          { refresh_token: refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );

        const newAccessToken = response.data.access_token;
        tokenUtils.setAccessToken(newAccessToken);

        // Resume all queued requests
        processQueue(null, newAccessToken);
        
        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return client(originalRequest);
      } catch (err: unknown) {
        // Refresh token failed or expired
        processQueue(axios.isAxiosError(err) ? err : null, null);
        tokenUtils.clearAllTokens();
        // Redirect to login could be handled by frontend window.location or a global event
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default client;
