import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import type { Transaction } from '@/types'

const transactionSchema = z.object({
  description: z
    .string()
    .min(1, 'Description is required')
    .max(100, 'Description must be 100 characters or less'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  date: z.string().min(1, 'Date is required'),
  category: z.enum(['income', 'expense']),
  account: z.string().min(1, 'Account is required'),
  status: z.enum(['completed', 'pending']),
})

export type TransactionFormData = z.infer<typeof transactionSchema>

interface TransactionFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: TransactionFormData) => void
  initialData?: Partial<Transaction>
  mode: 'create' | 'edit'
  isLoading?: boolean
}

// Computed once at module load to avoid impure calls during render.
const today = new Date().toISOString().split('T')[0]

/**
 * Modal form for creating or editing a transaction.
 * Uses React Hook Form + Zod for validation.
 */
export function TransactionForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
  isLoading = false,
}: TransactionFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: '',
      amount: 0,
      date: today,
      category: 'expense',
      account: 'Main Account',
      status: 'completed',
    },
  })

  useEffect(() => {
    if (isOpen) {
      reset({
        description: initialData?.description ?? '',
        amount: initialData?.amount ?? 0,
        date: initialData?.date ?? new Date().toISOString().split('T')[0],
        category: initialData?.category ?? 'expense',
        account: initialData?.account ?? 'Main Account',
        status: initialData?.status ?? 'completed',
      })
    }
  }, [isOpen, initialData, reset])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Add Transaction' : 'Edit Transaction'}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-2xl px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="transaction-form"
            disabled={isLoading}
            className="rounded-2xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
          >
            {isLoading
              ? 'Saving...'
              : mode === 'create'
              ? 'Add Transaction'
              : 'Save Changes'}
          </button>
        </>
      }
    >
      <form
        id="transaction-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div>
          <label
            htmlFor="description"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Description
          </label>
          <input
            id="description"
            {...register('description')}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 transition-colors focus:border-emerald-400 focus:bg-white focus:outline-none"
            placeholder="e.g. Grocery shopping"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-rose-500">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="amount"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Amount
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              {...register('amount', { valueAsNumber: true })}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 transition-colors focus:border-emerald-400 focus:bg-white focus:outline-none"
              placeholder="0.00"
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-rose-500">
                {errors.amount.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="date"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Date
            </label>
            <input
              id="date"
              type="date"
              {...register('date')}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 transition-colors focus:border-emerald-400 focus:bg-white focus:outline-none"
            />
            {errors.date && (
              <p className="mt-1 text-sm text-rose-500">
                {errors.date.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="category"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Category
            </label>
            <select
              id="category"
              {...register('category')}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 transition-colors focus:border-emerald-400 focus:bg-white focus:outline-none"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="status"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Status
            </label>
            <select
              id="status"
              {...register('status')}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 transition-colors focus:border-emerald-400 focus:bg-white focus:outline-none"
            >
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="account"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Account
          </label>
          <input
            id="account"
            {...register('account')}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 transition-colors focus:border-emerald-400 focus:bg-white focus:outline-none"
            placeholder="e.g. Main Account"
          />
          {errors.account && (
            <p className="mt-1 text-sm text-rose-500">
              {errors.account.message}
            </p>
          )}
        </div>
      </form>
    </Modal>
  )
}
