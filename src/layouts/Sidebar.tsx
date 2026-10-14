import { NavLink } from 'react-router-dom'
import {
  Wallet,
  PiggyBank,
  BarChart3,
  Archive,
  FolderOpen,
  Repeat,
  FileText,
  Gift,
  LogOut,
} from 'lucide-react'
import { useAppDispatch } from '@/hooks/store'
import { logout } from '@/features/auth/slices/authSlice'

const navigationItems = [
  { path: '/', label: 'My Balances', icon: Wallet },
  { path: '/savings', label: 'Savings', icon: PiggyBank },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/recurring', label: 'Recurring', icon: Repeat },
  { path: '/statements', label: 'Statements', icon: FileText },
  { path: '/box', label: 'My Box', icon: FolderOpen },
  { path: '/archives', label: 'Archives', icon: Archive },
]

const expenseGroups = [
  { id: 'family', label: 'Family' },
  { id: 'vacation', label: 'Vacation Planning' },
  { id: 'car', label: 'Buy a new car' },
  { id: 'festival', label: 'Festival Ideas' },
]

const incomeSources = [
  { id: 'work', label: 'Work' },
  { id: 'onboarding', label: 'Onboarding Plan' },
  { id: 'review', label: 'Website Review' },
  { id: 'presentation', label: 'Presentation Work' },
]

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-5 py-4">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        {title}
      </h2>
      {children}
    </div>
  )
}

export function Sidebar() {
  const dispatch = useAppDispatch()

  return (
    <aside className="flex w-64 flex-col overflow-y-auto border-r border-slate-200/60 bg-white/80 backdrop-blur-sm">
      {/* Logo */}
      <div className="px-6 py-6">
        <h1 className="text-xl font-bold text-slate-800">Retro</h1>
        <p className="mt-0.5 text-xs text-slate-400">Personal Finance</p>
      </div>

      {/* Main navigation */}
      <SidebarSection title="Navigation">
        <ul className="space-y-1">
          {navigationItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                  }`
                }
              >
                <item.icon className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </SidebarSection>

      {/* Expense groups */}
      <SidebarSection title="Expenses Groups">
        <ul className="space-y-2">
          {expenseGroups.map((group) => (
            <li key={group.id} className="flex items-center gap-3">
              <span className="flex h-4 w-4 items-center justify-center rounded border border-rose-300">
                {group.id === 'family' && (
                  <span className="h-2.5 w-2.5 rounded-sm bg-rose-400" />
                )}
              </span>
              <span className="text-sm text-slate-500">{group.label}</span>
            </li>
          ))}
        </ul>
      </SidebarSection>

      {/* Income sources */}
      <SidebarSection title="Income Sources">
        <ul className="space-y-2">
          {incomeSources.map((source) => (
            <li key={source.id} className="flex items-center gap-3">
              <span className="flex h-4 w-4 items-center justify-center rounded border border-emerald-400">
                {source.id === 'work' && (
                  <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
                )}
              </span>
              <span className="text-sm text-slate-500">{source.label}</span>
            </li>
          ))}
        </ul>
      </SidebarSection>

      {/* Gift / promo card */}
      <div className="mx-5 mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-4 text-white">
        <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
          <Gift className="h-4 w-4" aria-hidden="true" />
        </div>
        <p className="text-sm font-medium">Upgrade to Pro</p>
        <p className="mt-1 text-xs text-emerald-50">Unlock more insights</p>
      </div>

      {/* Logout */}
      <div className="mt-auto border-t border-slate-200/60 p-4">
        <button
          type="button"
          onClick={() => dispatch(logout())}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
        >
          <LogOut className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
