import { createFileRoute } from '@tanstack/react-router'
import { RxQuestionsPage } from '@/features/rxsoft/pages'

export const Route = createFileRoute('/_authenticated/questions/')({
  component: RxQuestionsPage,
})
