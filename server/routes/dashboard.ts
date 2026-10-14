import { Router } from 'express'
import {
  mockActivity,
  mockDashboardSummary,
  mockMonthlyData,
} from '../data/mock.ts'

const router = Router()

router.get('/summary', (_req, res) => {
  res.json(mockDashboardSummary)
})

router.get('/activity', (_req, res) => {
  res.json(mockActivity)
})

router.get('/monthly', (_req, res) => {
  res.json(mockMonthlyData)
})

export default router
