import { DataPageShell } from '@/features/components/page/data-page-shell'
import { workflowAttachmentPageSchema } from './conversation-page-schemas'

export function RxWorkflowConfigurationPage() {
  return <DataPageShell {...workflowAttachmentPageSchema} />
}
