import { useEffect } from 'react'
import { useAppDispatch } from '@/hooks/store'
import { verifyToken } from '@/features/auth/thunks/authThunks'

/**
 * On first load, verify any stored JWT access token with the server.
 * This restores the session after a browser refresh and handles expired tokens.
 */
export function AppInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(verifyToken())
  }, [dispatch])

  return <>{children}</>
}
