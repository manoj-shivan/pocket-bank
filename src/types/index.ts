export type TransactionCategory = 'income' | 'expense'
export type TransactionStatus = 'completed' | 'pending'
export type UserRole = 'user' | 'admin'

export interface Transaction {
  id: string
  date: string
  description: string
  category: TransactionCategory
  amount: number
  account: string
  status: TransactionStatus
}

export interface SavingsGoal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: string
}

export interface DashboardSummary {
  totalIncome: number
  paidInvoices: number
  unpaidInvoices: number
  monthlySavings: number
  incomeChange: number
  expenseChange: number
}

export interface MonthlyData {
  month: string
  income: number
  expense: number
  savings: number
}

export interface DailyActivity {
  date: string
  value: number
}

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
}
