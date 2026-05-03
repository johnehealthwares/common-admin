import { createFileRoute } from '@tanstack/react-router'
import { RxPharmaceuticsPage } from '@/features/rxsoft/pages'

export const Route = createFileRoute('/_authenticated/pharmaceutics/')({
  component: RxPharmaceuticsPage,
})
