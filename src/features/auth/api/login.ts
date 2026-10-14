import { apiClient } from '@/services/api-client'
import type { User } from '@/types'

interface LoginRequest {
  email: string
  password: string
}

interface LoginResponse {
  user: User
  token: string
}

/**
 * Sends login credentials to the API and receives a JWT access token.
 */
export async function loginUser(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/auth/login', credentials)
  return response.data
}

/**
 * Fetches the currently authenticated user from the verified JWT token.
 */
export async function getCurrentUser(): Promise<User> {
  const response = await apiClient.get<User>('/auth/me')
  return response.data
}
