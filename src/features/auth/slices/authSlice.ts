import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  isInitialized: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.isLoading = true
      state.error = null
    },
    loginSuccess(
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) {
      state.isLoading = false
      state.isAuthenticated = true
      state.isInitialized = true
      state.user = action.payload.user
      state.token = action.payload.token
      state.error = null
      localStorage.setItem('token', action.payload.token)
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.isLoading = false
      state.isInitialized = true
      state.error = action.payload
    },
    logout(state) {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.isInitialized = true
      state.error = null
      localStorage.removeItem('token')
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload
      state.isAuthenticated = true
      state.isInitialized = true
    },
  },
})

export const { loginStart, loginSuccess, loginFailure, logout, setUser } =
  authSlice.actions
export default authSlice.reducer

export const selectAuth = (state: { auth: AuthState }) => state.auth
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user
export const selectUserRole = (state: { auth: AuthState }) =>
  state.auth.user?.role ?? 'user'
export const selectIsAdmin = (state: { auth: AuthState }) =>
  state.auth.user?.role === 'admin'
export const selectIsAuthInitialized = (state: { auth: AuthState }) =>
  state.auth.isInitialized
