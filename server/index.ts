import express from 'express'
import cors from 'cors'
import dashboardRoutes from './routes/dashboard.ts'
import authRoutes from './routes/auth.ts'
import transactionsRoutes from './routes/transactions.ts'
import savingsRoutes from './routes/savings.ts'
import analyticsRoutes from './routes/analytics.ts'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use('/api/dashboard', dashboardRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/transactions', transactionsRoutes)
app.use('/api/savings', savingsRoutes)
app.use('/api/analytics', analyticsRoutes)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Mock API server running on http://localhost:${PORT}`)
})
