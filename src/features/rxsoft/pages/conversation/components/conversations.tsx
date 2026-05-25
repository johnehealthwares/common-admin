import { DataPageShell } from '@/features/components/page/data-page-shell'
import { conversationPageSchema } from './conversation-page-schemas'

export function RxConversationsPage() {
  return <DataPageShell {...conversationPageSchema} />
}
