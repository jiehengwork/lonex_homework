export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: {
    username: string;
    role: string;
  };
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface RefreshResponse {
  access_token: string;
  expires_in: number;
}
