import client from './client';
import type { UsersResponse } from './types/user';

export const userApi = {
  getUsers: async (page: number = 1, limit: number = 5): Promise<UsersResponse> => {
    const response = await client.get<UsersResponse>('/api/users', {
      params: { page, limit }
    });
    return response.data;
  },
};

