import { DataPageShell } from '@/features/components/page/data-page-shell'
import { exchangePageSchema } from './conversation-page-schemas'

export function RxExchangesPage() {
  return <DataPageShell {...exchangePageSchema} />
}
