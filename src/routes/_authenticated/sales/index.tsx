import { createFileRoute } from '@tanstack/react-router'
import { RxSalesPage } from '@/features/rxsoft/pages'

export const Route = createFileRoute('/_authenticated/sales/')({
  component: RxSalesPage,
})
