import { Router } from 'express'
import { mockMonthlyData } from '../data/mock.ts'
import { authenticateToken } from '../middleware/auth.ts'

const router = Router()

/**
 * GET /api/analytics
 * Returns aggregated analytics data for charts and reports.
 */
router.get('/', authenticateToken, (_req, res) => {
  // In a real app these would be computed from transaction records.
  // For the demo we combine mock monthly data with a category breakdown.
  const categories = [
    { category: 'Food & Dining', amount: 1200, percentage: 30, color: '#ff9270' },
    { category: 'Transportation', amount: 800, percentage: 20, color: '#4db18b' },
    { category: 'Entertainment', amount: 600, percentage: 15, color: '#ffcc52' },
    { category: 'Utilities', amount: 500, percentage: 12.5, color: '#64748b' },
    { category: 'Shopping', amount: 400, percentage: 10, color: '#f43f5e' },
    { category: 'Healthcare', amount: 300, percentage: 7.5, color: '#0d9488' },
    { category: 'Other', amount: 200, percentage: 5, color: '#cbd5e1' },
  ]

  res.json({
    monthly: mockMonthlyData,
    categories,
  })
})

export default router
