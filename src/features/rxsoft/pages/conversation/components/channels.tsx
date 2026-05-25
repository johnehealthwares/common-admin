import { DataPageShell } from '@/features/components/page/data-page-shell'
import { channelPageSchema } from './conversation-page-schemas'

export function RxChannelsPage() {
  return <DataPageShell {...channelPageSchema} />
}
