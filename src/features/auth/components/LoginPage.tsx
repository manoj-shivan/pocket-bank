import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAppDispatch, useAppSelector } from '@/hooks/store'
import { login } from '@/features/auth/thunks/authThunks'

/**
 * Validation schema for the login form.
 * Keeps rules simple so the demo is easy to use during interviews.
 */
const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

/**
 * Public login page.
 * Uses React Hook Form + Zod for type-safe validation.
 */
export default function LoginPage() {
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector((state) => state.auth)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@example.com',
      password: 'password',
    },
  })

  const onSubmit = (data: LoginFormData) => {
    dispatch(login(data))
  }

  return (
    <div className="flex min-h-full items-center justify-center bg-[#f3f4f8] p-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-800">Retro</h1>
          <p className="mt-2 text-slate-500">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register('email')}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 transition-colors focus:border-emerald-400 focus:bg-white focus:outline-none"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="mt-1.5 text-sm text-rose-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register('password')}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 transition-colors focus:border-emerald-400 focus:bg-white focus:outline-none"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1.5 text-sm text-rose-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {error && (
            <div className="rounded-2xl bg-rose-50 p-3 text-sm text-rose-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="h-12 w-full rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-3 text-center">
          <p className="text-xs font-medium text-slate-500">Demo credentials</p>
          <p className="mt-1 text-sm font-semibold text-slate-700">
            admin@example.com / password
          </p>
        </div>
      </div>
    </div>
  )
}
