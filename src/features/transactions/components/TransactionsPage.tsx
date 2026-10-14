import { useEffect, useMemo, useState } from 'react'
import { Plus, Search, Download, Filter, Trash2, Edit2 } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/hooks/store'
import { DataTable, type Column } from '@/components/data-table/DataTable'
import {
  createTransaction,
  deleteTransaction,
  loadTransactions,
  updateTransaction,
} from '@/features/transactions/thunks/transactionsThunks'
import {
  clearFilters,
  resetSaveStatus,
  selectTransactionsState,
  setCategoryFilter,
  setPage,
  setPageSize,
  setSearch,
  setStatusFilter,
} from '@/features/transactions/slices/transactionsSlice'
import { selectPaginatedTransactions } from '@/features/transactions/selectors/transactionsSelectors'
import { TransactionForm, type TransactionFormData } from './TransactionForm'
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal'
import { downloadCsv } from '@/utils/csv'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/dates'
import type { Transaction } from '@/types'

/**
 * Status badge colors for the transactions table.
 */
function StatusBadge({ status }: { status: Transaction['status'] }) {
  const isCompleted = status === 'completed'
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
        isCompleted
          ? 'bg-emerald-50 text-emerald-600'
          : 'bg-amber-50 text-amber-600'
      }`}
    >
      {status}
    </span>
  )
}

/**
 * Category badge colors for the transactions table.
 */
function CategoryBadge({ category }: { category: Transaction['category'] }) {
  const isIncome = category === 'income'
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
        isIncome ? 'bg-mint-100 text-emerald-700' : 'bg-rose-50 text-rose-500'
      }`}
    >
      {category}
    </span>
  )
}

export default function TransactionsPage() {
  const dispatch = useAppDispatch()
  const { data, total, page, pageSize, totalPages } = useAppSelector(
    selectPaginatedTransactions
  )
  const { status, saveStatus, filters } = useAppSelector(
    selectTransactionsState
  )

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null)

  // Load transactions whenever filters or pagination change.
  useEffect(() => {
    dispatch(
      loadTransactions({
        page,
        pageSize,
        search: filters.search,
        category: filters.category === 'all' ? undefined : filters.category,
        status: filters.status === 'all' ? undefined : filters.status,
      })
    )
  }, [dispatch, page, pageSize, filters])

  const columns = useMemo<Column<Transaction>[]>(
    () => [
      {
        key: 'description',
        header: 'Description',
        render: (row) => (
          <span className="font-medium text-slate-800">{row.description}</span>
        ),
      },
      {
        key: 'date',
        header: 'Date',
        width: '120px',
        render: (row) => (
          <span className="text-slate-500">{formatDate(row.date)}</span>
        ),
      },
      {
        key: 'category',
        header: 'Category',
        width: '110px',
        render: (row) => <CategoryBadge category={row.category} />,
      },
      {
        key: 'account',
        header: 'Account',
        render: (row) => <span className="text-slate-500">{row.account}</span>,
      },
      {
        key: 'amount',
        header: 'Amount',
        width: '130px',
        render: (row) => (
          <span
            className={`font-semibold ${
              row.category === 'income' ? 'text-emerald-600' : 'text-slate-800'
            }`}
          >
            {row.category === 'income' ? '+' : '-'}
            {formatCurrency(row.amount)}
          </span>
        ),
      },
      {
        key: 'status',
        header: 'Status',
        width: '110px',
        render: (row) => <StatusBadge status={row.status} />,
      },
      {
        key: 'actions',
        header: '',
        width: '100px',
        render: (row) => (
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => handleEdit(row)}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-emerald-600"
              aria-label={`Edit ${row.description}`}
            >
              <Edit2 className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setDeletingTransaction(row)}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-rose-500"
              aria-label={`Delete ${row.description}`}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ),
      },
    ],
    []
  )

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingTransaction(null)
    dispatch(resetSaveStatus())
  }

  const handleFormSubmit = (formData: TransactionFormData) => {
    if (editingTransaction) {
      dispatch(
        updateTransaction({
          id: editingTransaction.id,
          data: formData,
        })
      ).then(() => {
        closeForm()
      })
    } else {
      dispatch(createTransaction(formData)).then(() => {
        closeForm()
      })
    }
  }

  const handleDeleteConfirm = () => {
    if (!deletingTransaction) return
    dispatch(deleteTransaction(deletingTransaction.id)).then(() => {
      setDeletingTransaction(null)
    })
  }

  const handleExportCsv = () => {
    const exportData = data.map((t) => ({
      Description: t.description,
      Date: t.date,
      Category: t.category,
      Account: t.account,
      Amount: t.amount,
      Status: t.status,
    }))
    downloadCsv(exportData, 'transactions.csv')
  }

  const hasActiveFilters =
    filters.search || filters.category !== 'all' || filters.status !== 'all'

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Transactions</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage income and expense records
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add Transaction
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <Search
              className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search transactions..."
              value={filters.search}
              onChange={(e) => dispatch(setSearch(e.target.value))}
              className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 focus:border-emerald-400 focus:bg-white focus:outline-none lg:w-80"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" aria-hidden="true" />
              <select
                value={filters.category}
                onChange={(e) =>
                  dispatch(
                    setCategoryFilter(
                      e.target.value as Transaction['category'] | 'all'
                    )
                  )
                }
                className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 focus:border-emerald-400 focus:outline-none"
              >
                <option value="all">All Categories</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <select
              value={filters.status}
              onChange={(e) =>
                dispatch(
                  setStatusFilter(e.target.value as Transaction['status'] | 'all')
                )
              }
              className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 focus:border-emerald-400 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>

            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Export CSV
            </button>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">
            <span className="text-xs text-slate-400">Active filters:</span>
            <button
              type="button"
              onClick={() => dispatch(clearFilters())}
              className="text-xs font-medium text-emerald-600 hover:underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Data table */}
      <DataTable
        columns={columns}
        data={data}
        keyExtractor={(row) => row.id}
        page={page}
        pageSize={pageSize}
        total={total}
        totalPages={totalPages}
        onPageChange={(newPage) => dispatch(setPage(newPage))}
        onPageSizeChange={(newSize) => dispatch(setPageSize(newSize))}
        loading={status === 'pending'}
      />

      {/* Modals */}
      <TransactionForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={handleFormSubmit}
        initialData={editingTransaction ?? undefined}
        mode={editingTransaction ? 'edit' : 'create'}
        isLoading={saveStatus === 'pending'}
      />

      <DeleteConfirmationModal
        isOpen={!!deletingTransaction}
        onClose={() => setDeletingTransaction(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete transaction"
        message={`Are you sure you want to delete "${deletingTransaction?.description}"? This action cannot be undone.`}
        isLoading={saveStatus === 'pending'}
      />
    </div>
  )
}
