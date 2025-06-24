import { SimpleUser } from '@/app/types/user/user'

export const AUTH_ENDPOINTS = {
  login: 'api/v1/users/login/',
  refreshToken: 'api/v1/users/refresh/',
  logout: 'api/v1/users/logout/',
} as const

export const USER_ENDPOINTS = {
  getCurrentUser: 'api/v1/users/me/',
  updateProfile: 'api/v1/users/profile/',
} as const

// Types for API responses
export interface AuthResponse {
  access: string
  refresh: string
  user: {
    uuid: string
    email: string
    firstName: string
    lastName: string
    role: string
  }
}

export interface UserResponse extends SimpleUser {}

// Types for the endpoints
export type ApiEndpoints = {
  auth: typeof AUTH_ENDPOINTS
  user: typeof USER_ENDPOINTS
}

// Type for parameters
export interface LoginParams {
  email: string
  password: string
}

export interface UpdateProfileParams {
  fullName?: string
  email?: string
  currentPassword?: string
  newPassword?: string
}
