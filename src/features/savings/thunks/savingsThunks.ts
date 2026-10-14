import { createAsyncThunk } from '@reduxjs/toolkit'
import {
  fetchSavingsGoals,
  createSavingsGoal as createSavingsGoalApi,
  updateSavingsGoal as updateSavingsGoalApi,
  deleteSavingsGoal as deleteSavingsGoalApi,
  contributeToGoalApi,
} from '@/features/savings/api/savingsApi'
import type { SavingsGoal } from '@/types'

export const loadSavingsGoals = createAsyncThunk(
  'savings/loadSavingsGoals',
  async () => {
    const goals = await fetchSavingsGoals()
    return goals
  }
)

export const createSavingsGoal = createAsyncThunk(
  'savings/createSavingsGoal',
  async (data: Omit<SavingsGoal, 'id'>) => {
    const goal = await createSavingsGoalApi(data)
    return goal
  }
)

export const updateSavingsGoal = createAsyncThunk(
  'savings/updateSavingsGoal',
  async ({ id, data }: { id: string; data: Partial<Omit<SavingsGoal, 'id'>> }) => {
    const goal = await updateSavingsGoalApi(id, data)
    return goal
  }
)

export const deleteSavingsGoal = createAsyncThunk(
  'savings/deleteSavingsGoal',
  async (id: string) => {
    await deleteSavingsGoalApi(id)
    return id
  }
)

export const contributeToGoal = createAsyncThunk(
  'savings/contributeToGoal',
  async ({ id, amount }: { id: string; amount: number }) => {
    const goal = await contributeToGoalApi(id, amount)
    return goal
  }
)
