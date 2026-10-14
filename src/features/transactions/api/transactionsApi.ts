import { apiClient } from '@/services/api-client'
import type { Transaction } from '@/types'

export interface FetchTransactionsParams {
  search?: string
  category?: Transaction['category']
  status?: Transaction['status']
  dateFrom?: string
  dateTo?: string
  page?: number
  pageSize?: number
}

export interface FetchTransactionsResponse {
  data: Transaction[]
  total: number
  page: number
  pageSize: number
}

export async function fetchTransactions(
  params: FetchTransactionsParams = {}
): Promise<FetchTransactionsResponse> {
  const response = await apiClient.get<FetchTransactionsResponse>(
    '/transactions',
    { params }
  )
  return response.data
}

export async function createTransaction(
  data: Omit<Transaction, 'id'>
): Promise<Transaction> {
  const response = await apiClient.post<Transaction>('/transactions', data)
  return response.data
}

export async function updateTransaction(
  id: string,
  data: Partial<Omit<Transaction, 'id'>>
): Promise<Transaction> {
  const response = await apiClient.patch<Transaction>(`/transactions/${id}`, data)
  return response.data
}

export async function deleteTransaction(id: string): Promise<void> {
  await apiClient.delete(`/transactions/${id}`)
}
