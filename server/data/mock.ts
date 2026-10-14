import type {
  DashboardSummary,
  DailyActivity,
  MonthlyData,
  SavingsGoal,
  Transaction,
  User,
} from '../../src/types'

export const mockUser: User = {
  id: '1',
  email: 'admin@example.com',
  name: 'Sara',
  role: 'admin',
}

export const mockDashboardSummary: DashboardSummary = {
  totalIncome: 14130.0,
  paidInvoices: 19351.0,
  unpaidInvoices: 12399.99,
  monthlySavings: 42000.0,
  incomeChange: 12.5,
  expenseChange: -2.4,
}

export const mockMonthlyData: MonthlyData[] = [
  { month: 'Jan', income: 12000, expense: 8000, savings: 4000 },
  { month: 'Feb', income: 15000, expense: 9000, savings: 6000 },
  { month: 'Mar', income: 13000, expense: 8500, savings: 4500 },
  { month: 'Apr', income: 17000, expense: 10000, savings: 7000 },
  { month: 'May', income: 16000, expense: 9500, savings: 6500 },
  { month: 'Jun', income: 19000, expense: 11000, savings: 8000 },
]

export const mockActivity: DailyActivity[] = [
  { date: '2022-08-01', value: 1200 },
  { date: '2022-08-02', value: 1900 },
  { date: '2022-08-03', value: 1500 },
  { date: '2022-08-04', value: 2400 },
  { date: '2022-08-05', value: 2100 },
  { date: '2022-08-06', value: 2800 },
  { date: '2022-08-07', value: 3200 },
]

export const mockTransactions: Transaction[] = [
  {
    id: 't1',
    date: '2022-08-15',
    description: 'YouTube Ad Revenue',
    category: 'income',
    amount: 3500,
    account: 'Main Account',
    status: 'completed',
  },
  {
    id: 't2',
    date: '2022-08-14',
    description: 'Freelance Project',
    category: 'income',
    amount: 2400,
    account: 'PayPal',
    status: 'completed',
  },
  {
    id: 't3',
    date: '2022-08-12',
    description: 'Grocery Shopping',
    category: 'expense',
    amount: 180.5,
    account: 'Credit Card',
    status: 'completed',
  },
  {
    id: 't4',
    date: '2022-08-10',
    description: 'Software Subscription',
    category: 'expense',
    amount: 49.99,
    account: 'Main Account',
    status: 'pending',
  },
]

export const mockSavingsGoals: SavingsGoal[] = [
  {
    id: 's1',
    name: 'Vacation Planning',
    targetAmount: 5000,
    currentAmount: 3200,
    deadline: '2022-12-31',
  },
  {
    id: 's2',
    name: 'New Car',
    targetAmount: 20000,
    currentAmount: 8500,
    deadline: '2023-06-30',
  },
]
