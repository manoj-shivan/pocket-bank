import { apiClient } from '@/services/api-client'
import type { MonthlyData } from '@/types'

export interface CategoryBreakdown {
  category: string
  amount: number
  percentage: number
  color: string
}

export interface AnalyticsData {
  monthly: MonthlyData[]
  categories: CategoryBreakdown[]
}

export async function fetchAnalytics(): Promise<AnalyticsData> {
  const response = await apiClient.get<AnalyticsData>('/analytics')
  return response.data
}
