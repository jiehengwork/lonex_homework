// 負責管理 Token，將 Access Token 存在記憶體，Refresh Token 存在 LocalStorage

let inMemoryAccessToken: string | null = null;

export const tokenUtils = {
  getAccessToken: () => inMemoryAccessToken,
  setAccessToken: (token: string) => {
    inMemoryAccessToken = token;
  },
  clearAccessToken: () => {
    inMemoryAccessToken = null;
  },

  getRefreshToken: () => localStorage.getItem('refresh_token'),
  setRefreshToken: (token: string) => {
    localStorage.setItem('refresh_token', token);
  },
  clearRefreshToken: () => {
    localStorage.removeItem('refresh_token');
  },

  clearAllTokens: () => {
    inMemoryAccessToken = null;
    localStorage.removeItem('refresh_token');
  }
};
