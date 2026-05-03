import { createFileRoute } from '@tanstack/react-router'
import { RxWorkflowsPage } from '@/features/rxsoft/pages'

export const Route = createFileRoute('/_authenticated/workflows/')({
  component: RxWorkflowsPage,
})
