import { Suspense, lazy } from 'react'
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from 'react-router-dom'
import { useAppSelector } from '@/hooks/store'
import { AppLayout } from '@/layouts/AppLayout'
import { NotFound } from '@/components/NotFound'

const LoginPage = lazy(() => import('@/features/auth/components/LoginPage'))
const DashboardPage = lazy(
  () => import('@/features/dashboard/components/DashboardPage')
)
const TransactionsPage = lazy(
  () => import('@/features/transactions/components/TransactionsPage')
)
const SavingsGoalsPage = lazy(
  () => import('@/features/savings/components/SavingsGoalsPage')
)
const AnalyticsPage = lazy(
  () => import('@/features/analytics/components/AnalyticsPage')
)

/**
 * Redirects to login if the user is not authenticated.
 * Waits for token verification to finish before deciding so the page
 * does not flash the login screen on refresh.
 */
function ProtectedRoute() {
  const { isAuthenticated, isInitialized } = useAppSelector((state) => state.auth)

  if (!isInitialized) {
    return <PageSpinner />
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

/**
 * Redirects to dashboard if the user is already authenticated.
 * Also waits for token verification to avoid flashing the login form.
 */
function PublicRoute() {
  const { isAuthenticated, isInitialized } = useAppSelector((state) => state.auth)

  if (!isInitialized) {
    return <PageSpinner />
  }

  return !isAuthenticated ? <Outlet /> : <Navigate to="/" replace />
}

/**
 * Simple spinner used while lazy route chunks load.
 */
function PageSpinner() {
  return (
    <div className="flex h-full items-center justify-center">
      <div
        className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600"
        role="status"
        aria-label="Loading page"
      />
    </div>
  )
}

const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        path: '/login',
        element: (
          <Suspense fallback={<PageSpinner />}>
            <LoginPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: '/',
            element: (
              <Suspense fallback={<PageSpinner />}>
                <DashboardPage />
              </Suspense>
            ),
          },
          {
            path: '/transactions',
            element: (
              <Suspense fallback={<PageSpinner />}>
                <TransactionsPage />
              </Suspense>
            ),
          },
          {
            path: '/savings',
            element: (
              <Suspense fallback={<PageSpinner />}>
                <SavingsGoalsPage />
              </Suspense>
            ),
          },
          {
            path: '/analytics',
            element: (
              <Suspense fallback={<PageSpinner />}>
                <AnalyticsPage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
