import { createFileRoute } from '@tanstack/react-router'
import { RxRolesPage } from '@/features/rxsoft/pages'

export const Route = createFileRoute('/_authenticated/roles/')({
  component: RxRolesPage,
})
