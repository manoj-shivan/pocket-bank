import { createAsyncThunk } from '@reduxjs/toolkit'
import { fetchAnalytics } from '@/features/analytics/api/analyticsApi'

export const loadAnalytics = createAsyncThunk(
  'analytics/loadAnalytics',
  async () => {
    const data = await fetchAnalytics()
    return data
  }
)
