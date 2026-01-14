export interface CreateUserRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: 'CLIENT' | 'AGENT_BANCAIRE' | 'ADMIN';
}

export interface UserResponse {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  createdAt?: string; // Assuming these might exist
  updatedAt?: string;
}
