import { apiClient } from '@/services/api-client'
import type { SavingsGoal } from '@/types'

export async function fetchSavingsGoals(): Promise<SavingsGoal[]> {
  const response = await apiClient.get<SavingsGoal[]>('/savings')
  return response.data
}

export async function createSavingsGoal(
  data: Omit<SavingsGoal, 'id'>
): Promise<SavingsGoal> {
  const response = await apiClient.post<SavingsGoal>('/savings', data)
  return response.data
}

export async function updateSavingsGoal(
  id: string,
  data: Partial<Omit<SavingsGoal, 'id'>>
): Promise<SavingsGoal> {
  const response = await apiClient.patch<SavingsGoal>(`/savings/${id}`, data)
  return response.data
}

export async function deleteSavingsGoal(id: string): Promise<void> {
  await apiClient.delete(`/savings/${id}`)
}

export async function contributeToGoalApi(
  id: string,
  amount: number
): Promise<SavingsGoal> {
  const response = await apiClient.post<SavingsGoal>(`/savings/${id}/contribute`, {
    amount,
  })
  return response.data
}
