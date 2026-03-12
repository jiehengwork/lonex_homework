import client from './client';
import type { LoginRequest, LoginResponse, RefreshRequest, RefreshResponse } from './types/auth';

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await client.post<LoginResponse>('/auth', data);
    return response.data;
  },
  refresh: async (data: RefreshRequest): Promise<RefreshResponse> => {
    const response = await client.post<RefreshResponse>('/auth/refresh', data);
    return response.data;
  },
  // 你可以在此處新增其他 auth 群組的 API，例如 logout 等
};

