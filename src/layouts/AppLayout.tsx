import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/layouts/Sidebar'
import { TopBar } from '@/layouts/TopBar'

/**
 * Main application shell used for every authenticated route.
 * Fixed-width sidebar + a scrollable main area that holds page content.
 */
export function AppLayout() {
  return (
    <div className="flex h-full w-full bg-[#f3f4f8]">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />

        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
