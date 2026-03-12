import { authApi } from './auth';
import { userApi } from './user';

/**
 * 集中管理所有 API
 * 使用範例: api.auth.login({ username: '...', password: '...' })
 */
const api = {
  auth: authApi,
  user: userApi,
};

export default api;
