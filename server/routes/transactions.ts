import { Router } from 'express'
import { mockTransactions } from '../data/mock.ts'
import { authenticateToken } from '../middleware/auth.ts'
import type { Transaction } from '../../src/types/index.ts'

const router = Router()

/**
 * GET /api/transactions
 * Returns a paginated, filtered list of transactions.
 * Query params: search, category, status, page, pageSize
 */
router.get('/', authenticateToken, (req, res) => {
  const {
    search,
    category,
    status,
    page = '1',
    pageSize = '10',
  } = req.query as {
    search?: string
    category?: Transaction['category']
    status?: Transaction['status']
    page?: string
    pageSize?: string
  }

  let filtered = [...mockTransactions]

  if (search) {
    const lowerSearch = search.toLowerCase()
    filtered = filtered.filter(
      (t) =>
        t.description.toLowerCase().includes(lowerSearch) ||
        t.amount.toString().includes(search)
    )
  }

  if (category) {
    filtered = filtered.filter((t) => t.category === category)
  }

  if (status) {
    filtered = filtered.filter((t) => t.status === status)
  }

  const total = filtered.length
  const pageNum = Math.max(1, parseInt(page, 10) || 1)
  const sizeNum = Math.max(1, parseInt(pageSize, 10) || 10)
  const start = (pageNum - 1) * sizeNum
  const paginated = filtered.slice(start, start + sizeNum)

  res.json({
    data: paginated,
    total,
    page: pageNum,
    pageSize: sizeNum,
  })
})

/**
 * POST /api/transactions
 * Creates a new transaction.
 */
router.post('/', authenticateToken, (req, res) => {
  const body = req.body as Omit<Transaction, 'id'>
  const newTransaction: Transaction = {
    ...body,
    id: 't' + Date.now(),
  }
  mockTransactions.unshift(newTransaction)
  res.status(201).json(newTransaction)
})

/**
 * PATCH /api/transactions/:id
 * Updates an existing transaction.
 */
router.patch('/:id', authenticateToken, (req, res) => {
  const { id } = req.params
  const index = mockTransactions.findIndex((t) => t.id === id)

  if (index === -1) {
    res.status(404).json({ message: 'Transaction not found' })
    return
  }

  mockTransactions[index] = {
    ...mockTransactions[index],
    ...(req.body as Partial<Transaction>),
  }

  res.json(mockTransactions[index])
})

/**
 * DELETE /api/transactions/:id
 * Deletes a transaction.
 */
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params
  const index = mockTransactions.findIndex((t) => t.id === id)

  if (index === -1) {
    res.status(404).json({ message: 'Transaction not found' })
    return
  }

  mockTransactions.splice(index, 1)
  res.status(204).send()
})

export default router
