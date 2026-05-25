import { DataPageShell } from '@/features/components/page/data-page-shell'
import { workflowEventPageSchema } from './conversation-page-schemas'

export function RxWorkflowEventsPage() {
  return <DataPageShell {...workflowEventPageSchema} />
}
