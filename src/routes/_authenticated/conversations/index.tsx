import { createFileRoute } from '@tanstack/react-router'
import { RxConversationsPage } from '@/features/rxsoft/pages'

export const Route = createFileRoute('/_authenticated/conversations/')({
  component: RxConversationsPage,
})
