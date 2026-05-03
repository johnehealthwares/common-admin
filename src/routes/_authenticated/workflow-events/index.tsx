import { createFileRoute } from '@tanstack/react-router'
import { RxWorkflowEventsPage } from '@/features/rxsoft/pages'

export const Route = createFileRoute('/_authenticated/workflow-events/')({
  component: RxWorkflowEventsPage,
})
