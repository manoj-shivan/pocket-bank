import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  MoreHorizontal,
  Trash2,
  Edit2,
} from 'lucide-react'
import { formatCurrency } from '@/utils/currency'
import { formatRelativeDate } from '@/utils/dates'

/**
 * Mock KPI data shown in the top row of the dashboard.
 * Each card displays a value and a percentage change vs the previous period.
 */
const kpiData = [
  {
    label: 'Expected from YouTube',
    value: 14130.0,
    change: 12.5,
    period: 'Current Month',
  },
  {
    label: 'Expected from Twitch',
    value: 19351.0,
    change: 8.2,
    period: 'Current Month',
  },
  { label: 'Salary', value: 12399.99, change: -2.4, period: 'Current Month' },
  {
    label: 'Expected Monthly Income',
    value: 42000.0,
    change: 5.1,
    period: 'Current Month',
  },
]

/**
 * Quick overview cards with mini-charts.
 * Each card uses a soft pastel background to match the reference UI.
 */
const overviewCards = [
  {
    title: 'Social Media',
    value: 14000,
    chart: 'area',
    bgClass: 'bg-mint-100/60',
    strokeColor: '#4db18b',
    fillColor: '#a0dec7',
    data: [
      { x: 1, y: 3000 },
      { x: 2, y: 5000 },
      { x: 3, y: 4000 },
      { x: 4, y: 7000 },
      { x: 5, y: 6000 },
      { x: 6, y: 8500 },
      { x: 7, y: 9000 },
      { x: 8, y: 14000 },
    ],
  },
  {
    title: 'Freelancing',
    value: 19000,
    chart: 'line',
    bgClass: 'bg-cream-100/60',
    strokeColor: '#f59e0b',
    fillColor: '#ffeab3',
    data: [
      { x: 1, y: 8000 },
      { x: 2, y: 6000 },
      { x: 3, y: 11000 },
      { x: 4, y: 9000 },
      { x: 5, y: 15000 },
      { x: 6, y: 12000 },
      { x: 7, y: 19000 },
    ],
  },
  {
    title: 'Salary',
    value: 12000,
    chart: 'bar',
    bgClass: 'bg-peach-100/60',
    strokeColor: '#ff9270',
    fillColor: '#ffb49b',
    data: [
      { x: 1, y: 2000 },
      { x: 2, y: 3500 },
      { x: 3, y: 2800 },
      { x: 4, y: 4200 },
      { x: 5, y: 3900 },
      { x: 6, y: 5100 },
      { x: 7, y: 4800 },
      { x: 8, y: 12000 },
    ],
  },
]

/**
 * Cash-flow activity shown in the bottom-right chart.
 */
const activityData = [
  { month: 'March', value: 32000 },
  { month: 'April', value: 38000 },
  { month: 'May', value: 35000 },
  { month: 'June', value: 42000 },
  { month: 'July', value: 39000 },
  { month: 'August', value: 53136 },
  { month: 'September', value: 48000 },
  { month: 'October', value: 52000 },
  { month: 'November', value: 56000 },
  { month: 'December', value: 61000 },
]

/**
 * Recently added contacts list.
 */
const recentContacts = [
  {
    id: '1',
    name: 'Angela Taylor',
    time: '2022-08-11T14:30:00Z',
    avatar: 'Angela',
  },
  {
    id: '2',
    name: 'Michelle',
    time: '2022-08-11T14:05:00Z',
    avatar: 'Michelle',
  },
  {
    id: '3',
    name: 'Jennifer Williams',
    time: '2022-08-08T10:20:00Z',
    avatar: 'Jennifer',
  },
]

/**
 * Renders a small badge showing a percentage change.
 * Positive values are green; negative values are red.
 */
function ChangeBadge({ change }: { change: number }) {
  const isPositive = change >= 0

  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
        isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'
      }`}
    >
      {isPositive ? (
        <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
      ) : (
        <ArrowDownRight className="h-3 w-3" aria-hidden="true" />
      )}
      {Math.abs(change)}%
    </span>
  )
}

/**
 * Main dashboard page.
 * Displays KPIs, quick overview cards, balance card, contacts, and an activity chart.
 */
export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* KPI row */}
      <section>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {kpiData.map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-3xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <p className="text-sm font-medium text-slate-500">{kpi.label}</p>
              <p className="mt-1.5 text-2xl font-bold text-slate-800">
                {formatCurrency(kpi.value)}
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs">
                <ChangeBadge change={kpi.change} />
                <span className="text-slate-400">{kpi.period}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick overview + balance card */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Quick Overview</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* Three overview cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 xl:col-span-2">
            {overviewCards.map((card) => (
              <div
                key={card.title}
                className={`relative overflow-hidden rounded-3xl ${card.bgClass} p-5`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      ${(card.value / 1000).toFixed(0)}k
                    </p>
                    <p className="mt-0.5 text-lg font-semibold text-slate-700">
                      {card.title}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="rounded-full bg-white/60 p-1.5 text-slate-500 backdrop-blur-sm transition-colors hover:bg-white"
                    aria-label={`${card.title} details`}
                  >
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-4 h-20">
                  <ResponsiveContainer width="100%" height="100%">
                    {card.chart === 'area' && (
                      <AreaChart data={card.data}>
                        <Area
                          type="monotone"
                          dataKey="y"
                          stroke={card.strokeColor}
                          fill={card.fillColor}
                          strokeWidth={2.5}
                        />
                      </AreaChart>
                    )}
                    {card.chart === 'line' && (
                      <LineChart data={card.data}>
                        <Line
                          type="monotone"
                          dataKey="y"
                          stroke={card.strokeColor}
                          strokeWidth={2.5}
                          dot={{ r: 3, fill: card.strokeColor }}
                        />
                      </LineChart>
                    )}
                    {card.chart === 'bar' && (
                      <BarChart data={card.data}>
                        <Bar
                          dataKey="y"
                          fill={card.fillColor}
                          radius={[3, 3, 0, 0]}
                        />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>

          {/* My balance card */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">My Balance</h2>
              <button
                type="button"
                className="text-sm font-medium text-emerald-600 hover:underline"
              >
                Next
              </button>
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 to-emerald-700 p-6 text-white shadow-lg">
              {/* Decorative leaf-like circles */}
              <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
              <div className="absolute -bottom-10 -right-6 h-32 w-32 rounded-full bg-white/10" />

              <div className="relative">
                <p className="text-xs font-medium uppercase tracking-wider text-emerald-100">
                  Card Number
                </p>
                <p className="mt-2 text-xl font-medium tracking-widest">
                  3829 4820 4629 5025
                </p>

                <div className="mt-8 flex items-end justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-emerald-100">
                      Card Holder Name
                    </p>
                    <p className="mt-1 font-medium">AR Shakir</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wider text-emerald-100">
                      Expiry Date
                    </p>
                    <p className="mt-1 font-medium">09/17</p>
                  </div>
                </div>
              </div>

              <CreditCard className="absolute bottom-5 right-5 h-8 w-8 text-emerald-200/70" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      {/* Bottom row: contacts + activity */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Recently added contacts */}
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">Recently Added Contacts</h3>
            <button
              type="button"
              className="text-xs font-medium text-emerald-600 hover:underline"
            >
              View All
            </button>
          </div>

          <ul className="space-y-4">
            {recentContacts.map((contact) => (
              <li
                key={contact.id}
                className="flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-slate-50"
              >
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${contact.avatar}`}
                  alt=""
                  className="h-11 w-11 rounded-full bg-slate-100"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">
                    {contact.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {formatRelativeDate(contact.time)}
                  </p>
                </div>

                {contact.name === 'Michelle' ? (
                  <div className="flex items-center gap-1 rounded-xl bg-emerald-600 p-1 text-white">
                    <button
                      type="button"
                      className="rounded-lg p-1.5 hover:bg-emerald-700"
                      aria-label={`Delete ${contact.name}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="rounded-lg p-1.5 hover:bg-emerald-700"
                      aria-label={`Edit ${contact.name}`}
                    >
                      <Edit2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                    aria-label={`Options for ${contact.name}`}
                  >
                    <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Last 30 days activity */}
        <div className="rounded-3xl bg-white p-6 shadow-sm xl:col-span-2">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-slate-800">
                Last 30 Days Activity
              </h3>
              <p className="mt-1 text-3xl font-bold text-slate-800">
                {formatCurrency(53136.49)}
              </p>
              <p className="text-sm text-slate-400">August 2022</p>
            </div>
            <button
              type="button"
              className="rounded-xl bg-slate-50 p-2 text-slate-400 transition-colors hover:bg-slate-100"
              aria-label="View full activity"
            >
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <YAxis hide />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length > 0) {
                      const value = payload[0].value as number
                      return (
                        <div className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm">
                          <p className="text-sm font-semibold text-slate-800">
                            {formatCurrency(value)}
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#10b981"
                  fill="url(#activityGradient)"
                  strokeWidth={2}
                  activeDot={{ r: 5, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  )
}
