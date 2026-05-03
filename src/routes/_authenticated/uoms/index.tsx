import { createFileRoute } from '@tanstack/react-router'
import { RxUomsPage } from '@/features/rxsoft/pages'

export const Route = createFileRoute('/_authenticated/uoms/')({
  component: RxUomsPage,
})
