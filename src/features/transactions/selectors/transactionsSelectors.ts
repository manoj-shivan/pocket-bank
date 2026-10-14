import { createSelector } from '@reduxjs/toolkit'
import {
  selectAllTransactions,
  selectTransactionsState,
} from '@/features/transactions/slices/transactionsSlice'

/**
 * Filters the transaction list based on current search, category, status,
 * and date-range filters. Search matches description or amount.
 */
export const selectFilteredTransactions = createSelector(
  [selectAllTransactions, selectTransactionsState],
  (transactions, state) => {
    const { search, category, status, dateFrom, dateTo } = state.filters

    return transactions.filter((transaction) => {
      const matchesSearch =
        !search ||
        transaction.description.toLowerCase().includes(search.toLowerCase()) ||
        transaction.amount.toString().includes(search)

      const matchesCategory =
        category === 'all' || transaction.category === category

      const matchesStatus =
        status === 'all' || transaction.status === status

      const matchesDateFrom =
        !dateFrom || new Date(transaction.date) >= new Date(dateFrom)

      const matchesDateTo =
        !dateTo || new Date(transaction.date) <= new Date(dateTo)

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus &&
        matchesDateFrom &&
        matchesDateTo
      )
    })
  }
)

/**
 * Returns the currently visible page of transactions.
 */
export const selectPaginatedTransactions = createSelector(
  [selectFilteredTransactions, selectTransactionsState],
  (filtered, state) => {
    const { page, pageSize } = state.pagination
    const start = (page - 1) * pageSize
    const end = start + pageSize
    return {
      data: filtered.slice(start, end),
      total: filtered.length,
      page,
      pageSize,
      totalPages: Math.ceil(filtered.length / pageSize) || 1,
    }
  }
)
