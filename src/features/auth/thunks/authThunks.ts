import { createAsyncThunk } from '@reduxjs/toolkit'
import { getCurrentUser, loginUser } from '@/features/auth/api/login'
import {
  loginFailure,
  loginStart,
  loginSuccess,
  logout,
} from '@/features/auth/slices/authSlice'

interface LoginCredentials {
  email: string
  password: string
}

/**
 * Performs login and stores the returned JWT access token in localStorage.
 */
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { dispatch }) => {
    try {
      dispatch(loginStart())
      const data = await loginUser(credentials)
      dispatch(loginSuccess(data))
      return data
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Login failed'
      dispatch(loginFailure(message))
      throw error
    }
  }
)

/**
 * Verifies a stored JWT token by calling /api/auth/me.
 * Used on app startup to restore an existing session.
 */
export const verifyToken = createAsyncThunk(
  'auth/verifyToken',
  async (_, { dispatch }) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        dispatch(logout())
        return null
      }

      const user = await getCurrentUser()
      dispatch(loginSuccess({ user, token }))
      return user
    } catch {
      dispatch(logout())
      return null
    }
  }
)
