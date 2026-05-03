import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { AuthenticatedLayout } from '@/layout/authenticated-layout'

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
  beforeLoad: ({ location }) => {
    useAuthStore.getState().bootstrap()
    if (!useAuthStore.getState().user) {
      throw redirect({
        to: '/sign-in',
        search: { redirect: location.href },
      })
    }
  },
})
