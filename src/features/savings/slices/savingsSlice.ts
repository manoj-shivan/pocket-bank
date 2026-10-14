import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import {
  loadSavingsGoals,
  createSavingsGoal,
  updateSavingsGoal,
  deleteSavingsGoal,
  contributeToGoal,
} from '@/features/savings/thunks/savingsThunks'
import type { SavingsGoal } from '@/types'

type LoadingStatus = 'idle' | 'pending' | 'succeeded' | 'failed'

interface SavingsState {
  status: LoadingStatus
  saveStatus: LoadingStatus
  error: string | null
}

const savingsAdapter = createEntityAdapter<SavingsGoal>({
  sortComparer: (a, b) => a.deadline.localeCompare(b.deadline),
})

const initialState = savingsAdapter.getInitialState<SavingsState>({
  status: 'idle',
  saveStatus: 'idle',
  error: null,
})

const savingsSlice = createSlice({
  name: 'savings',
  initialState,
  reducers: {
    resetSavingsSaveStatus(state) {
      state.saveStatus = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Load goals
      .addCase(loadSavingsGoals.pending, (state) => {
        state.status = 'pending'
        state.error = null
      })
      .addCase(loadSavingsGoals.fulfilled, (state, action) => {
        state.status = 'succeeded'
        savingsAdapter.setAll(state, action.payload)
      })
      .addCase(loadSavingsGoals.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Failed to load savings goals'
      })

      // Create goal
      .addCase(createSavingsGoal.pending, (state) => {
        state.saveStatus = 'pending'
        state.error = null
      })
      .addCase(createSavingsGoal.fulfilled, (state, action) => {
        state.saveStatus = 'succeeded'
        savingsAdapter.addOne(state, action.payload)
      })
      .addCase(createSavingsGoal.rejected, (state, action) => {
        state.saveStatus = 'failed'
        state.error = action.error.message ?? 'Failed to create savings goal'
      })

      // Update goal
      .addCase(updateSavingsGoal.pending, (state) => {
        state.saveStatus = 'pending'
        state.error = null
      })
      .addCase(updateSavingsGoal.fulfilled, (state, action) => {
        state.saveStatus = 'succeeded'
        savingsAdapter.updateOne(state, {
          id: action.payload.id,
          changes: action.payload,
        })
      })
      .addCase(updateSavingsGoal.rejected, (state, action) => {
        state.saveStatus = 'failed'
        state.error = action.error.message ?? 'Failed to update savings goal'
      })

      // Delete goal
      .addCase(deleteSavingsGoal.pending, (state) => {
        state.saveStatus = 'pending'
        state.error = null
      })
      .addCase(deleteSavingsGoal.fulfilled, (state, action) => {
        state.saveStatus = 'succeeded'
        savingsAdapter.removeOne(state, action.payload)
      })
      .addCase(deleteSavingsGoal.rejected, (state, action) => {
        state.saveStatus = 'failed'
        state.error = action.error.message ?? 'Failed to delete savings goal'
      })

      // Contribute to goal
      .addCase(contributeToGoal.pending, (state) => {
        state.saveStatus = 'pending'
        state.error = null
      })
      .addCase(contributeToGoal.fulfilled, (state, action) => {
        state.saveStatus = 'succeeded'
        savingsAdapter.updateOne(state, {
          id: action.payload.id,
          changes: action.payload,
        })
      })
      .addCase(contributeToGoal.rejected, (state, action) => {
        state.saveStatus = 'failed'
        state.error = action.error.message ?? 'Failed to add contribution'
      })
  },
})

export const { resetSavingsSaveStatus } = savingsSlice.actions
export default savingsSlice.reducer

export const {
  selectAll: selectAllSavingsGoals,
  selectById: selectSavingsGoalById,
  selectTotal: selectSavingsGoalsTotal,
} = savingsAdapter.getSelectors(
  (state: { savings: typeof initialState }) => state.savings
)

export const selectSavingsState = (state: { savings: typeof initialState }) =>
  state.savings
