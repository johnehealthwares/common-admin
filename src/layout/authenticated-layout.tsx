import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from '@tanstack/react-router'
import { getCookie } from '@/lib/cookies'
import { isRouteAllowedForModule, getModuleDashboard } from '@/lib/module-routing'
import { useModuleStore } from '@/stores/module-store'
import { LayoutProvider } from '@/context/layout-provider'
import { SearchProvider } from '@/context/search-provider'
import { AppShell } from '@mantine/core'
import { AppSidebar } from './app-sidebar'

type AuthenticatedLayoutProps = {
  children?: React.ReactNode
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const defaultOpen = getCookie('sidebar_state') !== 'false'
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const selectedModule = useModuleStore((state) => state.selectedModule)

  // Guard: Check if current route is allowed for active module
  useEffect(() => {
    if (!isRouteAllowedForModule(pathname, selectedModule)) {
      navigate({ to: getModuleDashboard(selectedModule) })
    }
  }, [pathname, selectedModule, navigate])

  return (
    <SearchProvider>
      <LayoutProvider>
        <AppShell
          navbar={{ width: 260, breakpoint: 'sm' }}
          padding="md"
        >
          <AppSidebar />
          <AppShell.Main>
            {children ?? <Outlet />}
          </AppShell.Main>
        </AppShell>
      </LayoutProvider>
    </SearchProvider>
  )
}
