import { useEffect } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Download,
  TrendingUp,
  TrendingDown,
  PiggyBank,
} from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/hooks/store'
import { loadAnalytics } from '@/features/analytics/thunks/analyticsThunks'
import { selectAnalyticsState } from '@/features/analytics/slices/analyticsSlice'
import { downloadCsv } from '@/utils/csv'
import { formatCurrency } from '@/utils/currency'
import { cn } from '@/utils/cn'

const periodOptions = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
] as const

export default function AnalyticsPage() {
  const dispatch = useAppDispatch()
  const { monthly, categories, status, period } = useAppSelector(
    selectAnalyticsState
  )

  useEffect(() => {
    dispatch(loadAnalytics())
  }, [dispatch])

  const handleExportCsv = () => {
    const rows = monthly.map((row) => ({
      Month: row.month,
      Income: row.income,
      Expense: row.expense,
      Savings: row.savings,
    }))
    downloadCsv(rows, `analytics-${period}.csv`)
  }

  const totalIncome = monthly.reduce((sum, m) => sum + m.income, 0)
  const totalExpense = monthly.reduce((sum, m) => sum + m.expense, 0)
  const totalSavings = monthly.reduce((sum, m) => sum + m.savings, 0)

  const isLoading = status === 'pending'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Analytics</h1>
          <p className="mt-1 text-sm text-slate-500">
            Visualize income, spending, and savings trends
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-2xl border border-slate-200 bg-white p-1">
            {periodOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => dispatch({ type: 'analytics/setPeriod', payload: option.value })}
                className={cn(
                  'rounded-xl px-4 py-2 text-sm font-medium transition-colors',
                  period === option.value
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-500 hover:bg-slate-100'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <SummaryCard
          icon={TrendingUp}
          label="Total Income"
          value={formatCurrency(totalIncome)}
          color="text-emerald-600"
          bgColor="bg-emerald-50"
        />
        <SummaryCard
          icon={TrendingDown}
          label="Total Expense"
          value={formatCurrency(totalExpense)}
          color="text-rose-500"
          bgColor="bg-rose-50"
        />
        <SummaryCard
          icon={PiggyBank}
          label="Total Savings"
          value={formatCurrency(totalSavings)}
          color="text-teal-600"
          bgColor="bg-teal-50"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-80 animate-pulse rounded-3xl bg-slate-200" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Income vs Expense */}
          <div className="rounded-3xl bg-white p-6 shadow-sm lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">
                Income vs Expense
              </h3>
              <span className="text-sm text-slate-500 capitalize">{period} view</span>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthly} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    tickFormatter={(v) => `$${v / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    }}
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="income"
                    name="Income"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expense"
                    name="Expense"
                    stroke="#f43f5e"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category breakdown */}
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h3 className="mb-6 font-semibold text-slate-800">Spending by Category</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categories}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="amount"
                    nameKey="category"
                    label={({ percent }) =>
                      `${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                  >
                    {categories.map((cat) => (
                      <Cell key={cat.category} fill={cat.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    }}
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <div key={cat.category} className="flex items-center gap-2 text-xs">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-slate-500">{cat.category}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Savings trend */}
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h3 className="mb-6 font-semibold text-slate-800">Savings Trend</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthly} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    tickFormatter={(v) => `$${v / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    }}
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                  <Bar
                    dataKey="savings"
                    name="Savings"
                    fill="#0d9488"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface SummaryCardProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  color: string
  bgColor: string
}

function SummaryCard({ icon: Icon, label, value, color, bgColor }: SummaryCardProps) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${bgColor} ${color}`}>
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
