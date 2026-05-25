import { DataPageShell } from '@/features/components/page/data-page-shell'
import { workflowPageSchema } from './conversation-page-schemas'

export function RxWorkflowsPage() {
  return <DataPageShell {...workflowPageSchema} />
}
