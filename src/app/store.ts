import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/features/auth/slices/authSlice'
import transactionsReducer from '@/features/transactions/slices/transactionsSlice'
import savingsReducer from '@/features/savings/slices/savingsSlice'
import analyticsReducer from '@/features/analytics/slices/analyticsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionsReducer,
    savings: savingsReducer,
    analytics: analyticsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/loginSuccess', 'auth/setUser'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
