import { Provider as ReduxProvider } from 'react-redux'
import { store } from '@/app/store'
import { AppInitializer } from '@/app/AppInitializer'

interface AppProvidersProps {
  children: React.ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ReduxProvider store={store}>
      <AppInitializer>{children}</AppInitializer>
    </ReduxProvider>
  )
}
