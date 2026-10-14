import { createSlice } from '@reduxjs/toolkit'
import { loadAnalytics } from '@/features/analytics/thunks/analyticsThunks'
import type { AnalyticsData } from '@/features/analytics/api/analyticsApi'

type LoadingStatus = 'idle' | 'pending' | 'succeeded' | 'failed'

interface AnalyticsState extends AnalyticsData {
  status: LoadingStatus
  error: string | null
  period: 'monthly' | 'quarterly' | 'yearly'
}

const initialState: AnalyticsState = {
  monthly: [],
  categories: [],
  status: 'idle',
  error: null,
  period: 'monthly',
}

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setPeriod(
      state,
      action: { payload: 'monthly' | 'quarterly' | 'yearly' }
    ) {
      state.period = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAnalytics.pending, (state) => {
        state.status = 'pending'
        state.error = null
      })
      .addCase(loadAnalytics.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.monthly = action.payload.monthly
        state.categories = action.payload.categories
      })
      .addCase(loadAnalytics.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Failed to load analytics'
      })
  },
})

export const { setPeriod } = analyticsSlice.actions
export default analyticsSlice.reducer

export const selectAnalyticsState = (state: { analytics: AnalyticsState }) =>
  state.analytics
