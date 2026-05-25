import { DataPageShell } from '@/features/components/page/data-page-shell'
import { participantPageSchema } from './conversation-page-schemas'

export function RxParticipantsPage() {
  return <DataPageShell {...participantPageSchema} />
}
