
import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from '@tanstack/react-router'
import { getCookie } from '@/lib/cookies'
import { isRouteAllowedForModule, getModuleDashboard } from '@/lib/module-routing'
import { LayoutProvider } from '@/context/layout-provider'
import { AppShell } from '@mantine/core'
import { AppSidebar } from './app-sidebar'
import { useModuleId } from '@/context/module-context'

type AuthenticatedLayoutProps = {
  children?: React.ReactNode
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const defaultOpen = getCookie('sidebar_state') !== 'false'
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const moduleId = useModuleId()

  // Guard: Check if current route is allowed for active module
  useEffect(() => {
    if (!isRouteAllowedForModule(pathname, moduleId)) {
      navigate({ to: getModuleDashboard(moduleId) })
    }
  }, [pathname, moduleId, navigate])

  return (
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
  )
}
