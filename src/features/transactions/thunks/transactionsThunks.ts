import { createAsyncThunk } from '@reduxjs/toolkit'
import {
  fetchTransactions,
  createTransaction as createTransactionApi,
  updateTransaction as updateTransactionApi,
  deleteTransaction as deleteTransactionApi,
  type FetchTransactionsParams,
} from '@/features/transactions/api/transactionsApi'
import type { Transaction } from '@/types'

/**
 * Fetches a paginated, filtered list of transactions from the API.
 */
export const loadTransactions = createAsyncThunk(
  'transactions/loadTransactions',
  async (params: FetchTransactionsParams) => {
    const response = await fetchTransactions(params)
    return response
  }
)

/**
 * Creates a new transaction and returns the created record.
 */
export const createTransaction = createAsyncThunk(
  'transactions/createTransaction',
  async (data: Omit<Transaction, 'id'>) => {
    const transaction = await createTransactionApi(data)
    return transaction
  }
)

/**
 * Updates an existing transaction.
 */
export const updateTransaction = createAsyncThunk(
  'transactions/updateTransaction',
  async ({
    id,
    data,
  }: {
    id: string
    data: Partial<Omit<Transaction, 'id'>>
  }) => {
    const transaction = await updateTransactionApi(id, data)
    return transaction
  }
)

/**
 * Deletes a transaction by id.
 */
export const deleteTransaction = createAsyncThunk(
  'transactions/deleteTransaction',
  async (id: string) => {
    await deleteTransactionApi(id)
    return id
  }
)
