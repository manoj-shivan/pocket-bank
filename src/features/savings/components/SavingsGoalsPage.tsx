import { useEffect, useMemo, useState } from 'react'
import { Plus, Target, Calendar, Trash2, Edit2, PiggyBank } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/hooks/store'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal'
import {
  loadSavingsGoals,
  createSavingsGoal,
  updateSavingsGoal,
  deleteSavingsGoal,
  contributeToGoal,
} from '@/features/savings/thunks/savingsThunks'
import {
  resetSavingsSaveStatus,
  selectAllSavingsGoals,
  selectSavingsState,
} from '@/features/savings/slices/savingsSlice'
import { SavingsGoalForm, type SavingsGoalFormData } from './SavingsGoalForm'
import { ContributionForm, type ContributionFormData } from './ContributionForm'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/dates'
import type { SavingsGoal } from '@/types'

/**
 * Computes a human-readable projected completion date based on recent velocity.
 * For the demo we assume a constant monthly contribution of 10% of remaining.
 */
function getProjectedDate(goal: SavingsGoal): string | null {
  const remaining = goal.targetAmount - goal.currentAmount
  if (remaining <= 0) return 'Goal reached'
  if (goal.currentAmount === 0) return null

  // Simple projection: if progress continues at the same monthly rate,
  // estimate months to completion. For demo purposes only.
  const monthlyRate = goal.currentAmount / 3 // assume 3 months of history
  const monthsNeeded = Math.ceil(remaining / monthlyRate)
  const projected = new Date()
  projected.setMonth(projected.getMonth() + monthsNeeded)
  return projected.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  })
}

export default function SavingsGoalsPage() {
  const dispatch = useAppDispatch()
  const goals = useAppSelector(selectAllSavingsGoals)
  const { status, saveStatus } = useAppSelector(selectSavingsState)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null)
  const [deletingGoal, setDeletingGoal] = useState<SavingsGoal | null>(null)
  const [contributingGoal, setContributingGoal] = useState<SavingsGoal | null>(null)

  useEffect(() => {
    dispatch(loadSavingsGoals())
  }, [dispatch])

  const summary = useMemo(() => {
    const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0)
    const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0)
    const completed = goals.filter((g) => g.currentAmount >= g.targetAmount).length
    return { totalTarget, totalSaved, completed }
  }, [goals])

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingGoal(null)
    dispatch(resetSavingsSaveStatus())
  }

  const handleFormSubmit = (formData: SavingsGoalFormData) => {
    const data = {
      ...formData,
      currentAmount: formData.currentAmount ?? 0,
    }

    if (editingGoal) {
      dispatch(
        updateSavingsGoal({
          id: editingGoal.id,
          data,
        })
      ).then(() => {
        closeForm()
      })
    } else {
      dispatch(createSavingsGoal(data)).then(() => {
        closeForm()
      })
    }
  }

  const handleDeleteConfirm = () => {
    if (!deletingGoal) return
    dispatch(deleteSavingsGoal(deletingGoal.id)).then(() => {
      setDeletingGoal(null)
    })
  }

  const handleContributionSubmit = (data: ContributionFormData) => {
    if (!contributingGoal) return
    dispatch(
      contributeToGoal({
        id: contributingGoal.id,
        amount: data.amount,
      })
    ).then(() => {
      setContributingGoal(null)
    })
  }

  const isLoading = status === 'pending'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Savings Goals</h1>
          <p className="mt-1 text-sm text-slate-500">
            Track progress and contributions toward your goals
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Create Goal
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <SummaryCard
          icon={Target}
          label="Total Target"
          value={formatCurrency(summary.totalTarget)}
        />
        <SummaryCard
          icon={PiggyBank}
          label="Total Saved"
          value={formatCurrency(summary.totalSaved)}
        />
        <SummaryCard
          icon={Calendar}
          label="Goals Completed"
          value={`${summary.completed} / ${goals.length}`}
        />
      </div>

      {/* Goals grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-3xl bg-slate-200"
            />
          ))}
        </div>
      ) : goals.length === 0 ? (
        <div className="rounded-3xl bg-white p-12 text-center shadow-sm">
          <PiggyBank className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-4 text-lg font-semibold text-slate-800">
            No savings goals yet
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Create your first goal to start tracking your savings.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {goals.map((goal) => (
            <SavingsGoalCard
              key={goal.id}
              goal={goal}
              onEdit={() => {
                setEditingGoal(goal)
                setIsFormOpen(true)
              }}
              onDelete={() => setDeletingGoal(goal)}
              onContribute={() => setContributingGoal(goal)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <SavingsGoalForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={handleFormSubmit}
        initialData={editingGoal ?? undefined}
        mode={editingGoal ? 'edit' : 'create'}
        isLoading={saveStatus === 'pending'}
      />

      <ContributionForm
        isOpen={!!contributingGoal}
        onClose={() => setContributingGoal(null)}
        onSubmit={handleContributionSubmit}
        goal={contributingGoal}
        isLoading={saveStatus === 'pending'}
      />

      <DeleteConfirmationModal
        isOpen={!!deletingGoal}
        onClose={() => setDeletingGoal(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete savings goal"
        message={`Are you sure you want to delete "${deletingGoal?.name}"? This action cannot be undone.`}
        isLoading={saveStatus === 'pending'}
      />
    </div>
  )
}

interface SummaryCardProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}

function SummaryCard({ icon: Icon, label, value }: SummaryCardProps) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs text-slate-500">{label}</p>
          <p className="text-lg font-bold text-slate-800">{value}</p>
        </div>
      </div>
    </div>
  )
}

interface SavingsGoalCardProps {
  goal: SavingsGoal
  onEdit: () => void
  onDelete: () => void
  onContribute: () => void
}

function SavingsGoalCard({
  goal,
  onEdit,
  onDelete,
  onContribute,
}: SavingsGoalCardProps) {
  const projectedDate = getProjectedDate(goal)
  const isCompleted = goal.currentAmount >= goal.targetAmount

  return (
    <div className="flex flex-col rounded-3xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-slate-800">{goal.name}</h3>
          <p className="mt-1 text-xs text-slate-500">
            Deadline: {formatDate(goal.deadline)}
          </p>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={onEdit}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-emerald-600"
            aria-label={`Edit ${goal.name}`}
          >
            <Edit2 className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-rose-500"
            aria-label={`Delete ${goal.name}`}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="mb-4 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-slate-800">
          {formatCurrency(goal.currentAmount)}
        </span>
        <span className="text-sm text-slate-400">
          / {formatCurrency(goal.targetAmount)}
        </span>
      </div>

      <ProgressBar
        value={goal.currentAmount}
        max={goal.targetAmount}
        className="mb-4"
      />

      {projectedDate && (
        <p className="mb-4 text-xs text-slate-500">
          Projected completion:{' '}
          <span className="font-medium text-slate-700">{projectedDate}</span>
        </p>
      )}

      {!isCompleted && (
        <button
          type="button"
          onClick={onContribute}
          className="mt-auto w-full rounded-2xl border border-emerald-200 bg-emerald-50 py-2.5 text-sm font-semibold text-emerald-600 transition-colors hover:bg-emerald-100"
        >
          Add Contribution
        </button>
      )}

      {isCompleted && (
        <div className="mt-auto rounded-2xl bg-emerald-50 py-2.5 text-center text-sm font-semibold text-emerald-600">
          Goal Reached
        </div>
      )}
    </div>
  )
}
