import {
  createEntityAdapter,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit'
import {
  loadTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '@/features/transactions/thunks/transactionsThunks'
import type { Transaction } from '@/types'

type LoadingStatus = 'idle' | 'pending' | 'succeeded' | 'failed'

interface TransactionsState {
  status: LoadingStatus
  saveStatus: LoadingStatus
  error: string | null
  filters: {
    search: string
    category: 'all' | Transaction['category']
    status: 'all' | Transaction['status']
    dateFrom: string
    dateTo: string
  }
  pagination: {
    page: number
    pageSize: number
    total: number
  }
}

const transactionsAdapter = createEntityAdapter<Transaction>({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
})

const initialState = transactionsAdapter.getInitialState<TransactionsState>({
  status: 'idle',
  saveStatus: 'idle',
  error: null,
  filters: {
    search: '',
    category: 'all',
    status: 'all',
    dateFrom: '',
    dateTo: '',
  },
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
  },
})

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.filters.search = action.payload
      state.pagination.page = 1
    },
    setCategoryFilter(
      state,
      action: PayloadAction<'all' | Transaction['category']>
    ) {
      state.filters.category = action.payload
      state.pagination.page = 1
    },
    setStatusFilter(
      state,
      action: PayloadAction<'all' | Transaction['status']>
    ) {
      state.filters.status = action.payload
      state.pagination.page = 1
    },
    setDateRange(
      state,
      action: PayloadAction<{ dateFrom: string; dateTo: string }>
    ) {
      state.filters.dateFrom = action.payload.dateFrom
      state.filters.dateTo = action.payload.dateTo
      state.pagination.page = 1
    },
    setPage(state, action: PayloadAction<number>) {
      state.pagination.page = action.payload
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.pagination.pageSize = action.payload
      state.pagination.page = 1
    },
    clearFilters(state) {
      state.filters = initialState.filters
      state.pagination.page = 1
    },
    resetSaveStatus(state) {
      state.saveStatus = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Load transactions
      .addCase(loadTransactions.pending, (state) => {
        state.status = 'pending'
        state.error = null
      })
      .addCase(loadTransactions.fulfilled, (state, action) => {
        state.status = 'succeeded'
        transactionsAdapter.setAll(state, action.payload.data)
        state.pagination.total = action.payload.total
      })
      .addCase(loadTransactions.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Failed to load transactions'
      })

      // Create transaction
      .addCase(createTransaction.pending, (state) => {
        state.saveStatus = 'pending'
        state.error = null
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.saveStatus = 'succeeded'
        transactionsAdapter.addOne(state, action.payload)
        state.pagination.total += 1
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.saveStatus = 'failed'
        state.error = action.error.message ?? 'Failed to create transaction'
      })

      // Update transaction
      .addCase(updateTransaction.pending, (state) => {
        state.saveStatus = 'pending'
        state.error = null
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.saveStatus = 'succeeded'
        transactionsAdapter.updateOne(state, {
          id: action.payload.id,
          changes: action.payload,
        })
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.saveStatus = 'failed'
        state.error = action.error.message ?? 'Failed to update transaction'
      })

      // Delete transaction
      .addCase(deleteTransaction.pending, (state) => {
        state.saveStatus = 'pending'
        state.error = null
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.saveStatus = 'succeeded'
        transactionsAdapter.removeOne(state, action.payload)
        state.pagination.total = Math.max(0, state.pagination.total - 1)
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.saveStatus = 'failed'
        state.error = action.error.message ?? 'Failed to delete transaction'
      })
  },
})

export const {
  setSearch,
  setCategoryFilter,
  setStatusFilter,
  setDateRange,
  setPage,
  setPageSize,
  clearFilters,
  resetSaveStatus,
} = transactionsSlice.actions

export default transactionsSlice.reducer

// Entity adapter selectors
export const {
  selectAll: selectAllTransactions,
  selectById: selectTransactionById,
  selectIds: selectTransactionIds,
  selectTotal: selectTransactionsTotal,
} = transactionsAdapter.getSelectors(
  (state: { transactions: typeof initialState }) => state.transactions
)

export type TransactionsRootState = { transactions: typeof initialState }

export const selectTransactionsState = (state: TransactionsRootState) =>
  state.transactions
