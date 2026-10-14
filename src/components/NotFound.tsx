import { Link } from 'react-router-dom'

/**
 * Simple 404 page shown for unknown routes.
 */
export function NotFound() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-[#f3f4f8] p-6 text-center">
      <h1 className="text-6xl font-bold text-slate-300">404</h1>
      <p className="mt-4 text-lg text-slate-600">Page not found</p>
      <Link
        to="/"
        className="mt-6 rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
      >
        Back to dashboard
      </Link>
    </div>
  )
}
