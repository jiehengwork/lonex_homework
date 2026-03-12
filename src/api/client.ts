import axios from 'axios';

const client = axios.create({
  baseURL: 'https://lbbj5pioquwxdexqmcnwaxrpce0lcoqx.lambda-url.ap-southeast-1.on.aws',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Interceptor example for adding tokens (if needed in the future)
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default client;
