import { createFileRoute } from '@tanstack/react-router'
import { RxQuestionnairesPage } from '@/features/rxsoft/pages'

export const Route = createFileRoute('/_authenticated/questionnaires/')({
  component: RxQuestionnairesPage,
})
