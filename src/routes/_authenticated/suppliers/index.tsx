import { createFileRoute } from '@tanstack/react-router'
import { RxSuppliersPage } from '@/features/rxsoft/pages'

export const Route = createFileRoute('/_authenticated/suppliers/')({
  component: RxSuppliersPage,
})
