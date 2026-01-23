export interface CreateUserRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: 'CLIENT' | 'AGENT_BANCAIRE' | 'ADMIN';
}

export interface UserResponse {
  id: string;
  fullName: string;
  email: string;
  role: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}