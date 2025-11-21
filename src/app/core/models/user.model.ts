// src/app/core/models/user.model.ts
export interface AppUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  profilePictureUrl?: string | null;
  role?: string;
}

export interface User extends AppUser {}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: AppUser;
}

export interface ApiResponse<T> {
  isSuccess: boolean;
  message?: string;
  data?: T;
  errors?: any;
}
