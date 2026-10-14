import { Search, Bell, Menu } from 'lucide-react'
import { useAppSelector } from '@/hooks/store'

/**
 * Sticky top bar shown inside authenticated pages.
 * Includes global search, quick nav links, notifications, and the user menu.
 */
export function TopBar() {
  const user = useAppSelector((state) => state.auth.user)

  return (
    <header className="flex items-center justify-between border-b border-slate-200/60 bg-white/80 px-6 py-3.5 backdrop-blur-sm lg:px-8">
      {/* Left side: mobile menu + search */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="relative hidden sm:block">
          <Search
            className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search..."
            className="h-11 w-72 rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Right side: quick links, notifications, profile */}
      <div className="flex items-center gap-6">
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-500 md:flex">
          <a href="#cards" className="hover:text-emerald-600">
            Cards
          </a>
          <a href="#invoices" className="hover:text-emerald-600">
            Invoices
          </a>
        </nav>

        <button
          type="button"
          className="relative rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" aria-hidden="true" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>

        <div className="flex items-center gap-3 pl-2">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-slate-800">
              Hi, {user?.name ?? 'Sara'}
            </p>
            <p className="text-xs capitalize text-slate-400">{user?.role ?? 'User'}</p>
          </div>
          <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-white shadow-sm">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sara"
              alt="User avatar"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
