import { createFileRoute } from '@tanstack/react-router'
import { RxPriceListsPage } from '@/features/rxsoft/pages'

export const Route = createFileRoute('/_authenticated/price-lists/')({
  component: RxPriceListsPage,
})
