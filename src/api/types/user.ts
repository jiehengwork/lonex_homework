export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  status: string;
  created_at: string;
}

export interface Pagination {
  total: number;
  current_page: number;
  per_page: number;
  total_pages: number;
}

export interface UsersResponse {
  data: User[];
  pagination: Pagination;
}
