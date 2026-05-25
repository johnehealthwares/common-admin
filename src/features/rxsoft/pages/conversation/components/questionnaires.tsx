import { DataPageShell } from '@/features/components/page/data-page-shell'
import { questionnairePageSchema } from './conversation-page-schemas'

export function RxQuestionnairesPage() {
  return <DataPageShell {...questionnairePageSchema} />
}
