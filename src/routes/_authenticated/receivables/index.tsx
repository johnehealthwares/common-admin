import { createFileRoute } from '@tanstack/react-router'
import { RxReceivablesPage } from '@/features/rxsoft/pages'

export const Route = createFileRoute('/_authenticated/receivables/')({
  component: RxReceivablesPage,
})
