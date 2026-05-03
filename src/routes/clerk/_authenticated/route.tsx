import { AuthenticatedLayout } from '@/layout/authenticated-layout'
import { createFileRoute } from '@tanstack/react-router'


export const Route = createFileRoute('/clerk/_authenticated')({
  component: AuthenticatedLayout,
})
