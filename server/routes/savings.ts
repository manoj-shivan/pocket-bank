import { Router } from 'express'
import { mockSavingsGoals } from '../data/mock.ts'
import { authenticateToken } from '../middleware/auth.ts'
import type { SavingsGoal } from '../../src/types/index.ts'

const router = Router()

/**
 * GET /api/savings
 * Returns all savings goals for the authenticated user.
 */
router.get('/', authenticateToken, (_req, res) => {
  res.json(mockSavingsGoals)
})

/**
 * POST /api/savings
 * Creates a new savings goal.
 */
router.post('/', authenticateToken, (req, res) => {
  const body = req.body as Omit<SavingsGoal, 'id'>

  // Business rule: current amount cannot exceed target by more than 10%
  if (body.currentAmount > body.targetAmount * 1.1) {
    res.status(400).json({
      message:
        'Current amount cannot exceed target amount by more than 10%',
    })
    return
  }

  const newGoal: SavingsGoal = {
    ...body,
    id: 's' + Date.now(),
  }

  mockSavingsGoals.push(newGoal)
  res.status(201).json(newGoal)
})

/**
 * PATCH /api/savings/:id
 * Updates an existing savings goal.
 */
router.patch('/:id', authenticateToken, (req, res) => {
  const { id } = req.params
  const index = mockSavingsGoals.findIndex((g) => g.id === id)

  if (index === -1) {
    res.status(404).json({ message: 'Savings goal not found' })
    return
  }

  const body = req.body as Partial<SavingsGoal>
  const updatedGoal = { ...mockSavingsGoals[index], ...body }

  // Enforce the 10% overflow business rule on updates as well.
  if (updatedGoal.currentAmount > updatedGoal.targetAmount * 1.1) {
    res.status(400).json({
      message:
        'Current amount cannot exceed target amount by more than 10%',
    })
    return
  }

  mockSavingsGoals[index] = updatedGoal
  res.json(updatedGoal)
})

/**
 * DELETE /api/savings/:id
 * Deletes a savings goal.
 */
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params
  const index = mockSavingsGoals.findIndex((g) => g.id === id)

  if (index === -1) {
    res.status(404).json({ message: 'Savings goal not found' })
    return
  }

  mockSavingsGoals.splice(index, 1)
  res.status(204).send()
})

/**
 * POST /api/savings/:id/contribute
 * Adds a contribution to a savings goal.
 */
router.post('/:id/contribute', authenticateToken, (req, res) => {
  const { id } = req.params
  const { amount } = req.body as { amount?: number }

  if (amount === undefined || amount <= 0) {
    res.status(400).json({ message: 'Contribution amount must be greater than 0' })
    return
  }

  const index = mockSavingsGoals.findIndex((g) => g.id === id)

  if (index === -1) {
    res.status(404).json({ message: 'Savings goal not found' })
    return
  }

  const goal = mockSavingsGoals[index]
  const newAmount = goal.currentAmount + amount

  if (newAmount > goal.targetAmount * 1.1) {
    res.status(400).json({
      message:
        'Contribution would exceed target amount by more than 10%',
    })
    return
  }

  goal.currentAmount = newAmount
  res.json(goal)
})

export default router
