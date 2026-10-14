import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { formatCurrency } from '@/utils/currency'
import type { SavingsGoal } from '@/types'

const contributionSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
})

export type ContributionFormData = z.infer<typeof contributionSchema>

interface ContributionFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ContributionFormData) => void
  goal: SavingsGoal | null
  isLoading?: boolean
}

export function ContributionForm({
  isOpen,
  onClose,
  onSubmit,
  goal,
  isLoading = false,
}: ContributionFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContributionFormData>({
    resolver: zodResolver(contributionSchema),
    defaultValues: { amount: 0 },
  })

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        reset()
        onClose()
      }}
      title="Add Contribution"
      footer={
        <>
          <button
            type="button"
            onClick={() => {
              reset()
              onClose()
            }}
            disabled={isLoading}
            className="rounded-2xl px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="contribution-form"
            disabled={isLoading}
            className="rounded-2xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
          >
            {isLoading ? 'Adding...' : 'Add Contribution'}
          </button>
        </>
      }
    >
      <form
        id="contribution-form"
        onSubmit={handleSubmit((data) => {
          onSubmit(data)
          reset()
        })}
        className="space-y-4"
      >
        {goal && (
          <div className="rounded-2xl bg-slate-50 p-4 text-sm">
            <p className="text-slate-500">Goal</p>
            <p className="font-semibold text-slate-800">{goal.name}</p>
            <div className="mt-2 flex justify-between text-slate-600">
              <span>Current: {formatCurrency(goal.currentAmount)}</span>
              <span>Target: {formatCurrency(goal.targetAmount)}</span>
            </div>
          </div>
        )}

        <div>
          <label
            htmlFor="contribution-amount"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Contribution Amount
          </label>
          <input
            id="contribution-amount"
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
      </form>
    </Modal>
  )
}
