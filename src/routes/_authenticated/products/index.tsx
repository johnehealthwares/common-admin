import { createFileRoute } from '@tanstack/react-router'
import { RxProductsPage } from '@/features/rxsoft/pages'

export const Route = createFileRoute('/_authenticated/products/')({
  component: RxProductsPage,
})
