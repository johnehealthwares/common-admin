import { createFileRoute } from '@tanstack/react-router'
import { RxParticipantsPage } from '@/features/rxsoft/pages/conversation'

export const Route = createFileRoute('/_authenticated/participants/')({
  component: RxParticipantsPage,
})
