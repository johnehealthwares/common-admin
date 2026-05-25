import { DataPageShell } from '@/features/components/page/data-page-shell'
import { workflowInstancePageSchema } from './conversation-page-schemas'

export function RxWorkflowInstancesPage() {
  return <DataPageShell {...workflowInstancePageSchema} />
}
