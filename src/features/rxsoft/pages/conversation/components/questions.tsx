import { DataPageShell } from '@/features/components/page/data-page-shell'
import { questionPageSchema } from './conversation-page-schemas'

export function RxQuestionsPage() {
  return <DataPageShell {...questionPageSchema} />
}
