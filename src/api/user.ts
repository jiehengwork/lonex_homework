import client from './client';
import type { UsersResponse } from './types/user';

export const userApi = {
  getUsers: async (): Promise<UsersResponse> => {
    const response = await client.get<UsersResponse>('/api/users');
    return response.data;
  },
};
