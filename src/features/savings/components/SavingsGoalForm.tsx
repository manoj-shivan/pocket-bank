import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import type { SavingsGoal } from '@/types'

const savingsGoalSchema = z.object({
  name: z.string().min(1, 'Goal name is required').max(100, 'Name is too long'),
  targetAmount: z.number().min(1, 'Target amount must be greater than 0'),
  currentAmount: z
    .number()
    .min(0, 'Current amount cannot be negative')
    .optional(),
  deadline: z.string().min(1, 'Deadline is required'),
})

export type SavingsGoalFormData = z.infer<typeof savingsGoalSchema>

interface SavingsGoalFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: SavingsGoalFormData) => void
  initialData?: Partial<SavingsGoal>
  mode: 'create' | 'edit'
  isLoading?: boolean
}

// Computed once at module load to avoid impure calls during render.
const defaultDeadline = new Date()
const defaultDeadlineString = new Date(
  defaultDeadline.getFullYear(),
  defaultDeadline.getMonth() + 1,
  defaultDeadline.getDate()
)
  .toISOString()
  .split('T')[0]

export function SavingsGoalForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
  isLoading = false,
}: SavingsGoalFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SavingsGoalFormData>({
    resolver: zodResolver(savingsGoalSchema),
    defaultValues: {
      name: '',
      targetAmount: 0,
      currentAmount: 0,
      deadline: defaultDeadlineString,
    },
  })

  useEffect(() => {
    if (isOpen) {
      reset({
        name: initialData?.name ?? '',
        targetAmount: initialData?.targetAmount ?? 0,
        currentAmount: initialData?.currentAmount ?? 0,
        deadline: initialData?.deadline ?? defaultDeadlineString,
      })
    }
  }, [isOpen, initialData, reset])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Create Savings Goal' : 'Edit Savings Goal'}
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
            form="savings-goal-form"
            disabled={isLoading}
            className="rounded-2xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
          >
            {isLoading
              ? 'Saving...'
              : mode === 'create'
              ? 'Create Goal'
              : 'Save Changes'}
          </button>
        </>
      }
    >
      <form
        id="savings-goal-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div>
          <label
            htmlFor="goal-name"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Goal Name
          </label>
          <input
            id="goal-name"
            {...register('name')}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 transition-colors focus:border-emerald-400 focus:bg-white focus:outline-none"
            placeholder="e.g. Vacation Planning"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-rose-500">{errors.name.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="target-amount"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Target Amount
            </label>
            <input
              id="target-amount"
              type="number"
              step="0.01"
              {...register('targetAmount', { valueAsNumber: true })}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 transition-colors focus:border-emerald-400 focus:bg-white focus:outline-none"
              placeholder="0.00"
            />
            {errors.targetAmount && (
              <p className="mt-1 text-sm text-rose-500">
                {errors.targetAmount.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="current-amount"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Current Amount
            </label>
            <input
              id="current-amount"
              type="number"
              step="0.01"
              {...register('currentAmount', { valueAsNumber: true })}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 transition-colors focus:border-emerald-400 focus:bg-white focus:outline-none"
              placeholder="0.00"
            />
            {errors.currentAmount && (
              <p className="mt-1 text-sm text-rose-500">
                {errors.currentAmount.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="deadline"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Deadline
          </label>
          <input
            id="deadline"
            type="date"
            {...register('deadline')}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 transition-colors focus:border-emerald-400 focus:bg-white focus:outline-none"
          />
          {errors.deadline && (
            <p className="mt-1 text-sm text-rose-500">
              {errors.deadline.message}
            </p>
          )}
        </div>
      </form>
    </Modal>
  )
}
