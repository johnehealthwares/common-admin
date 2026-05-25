import { createFileRoute } from '@tanstack/react-router'
import { MessagesPage } from '@/features/communication/components/messages'
import { ApplicationEntitiesPage } from '@/features/communication/components/ae'

export const Route = createFileRoute('/_authenticated/aes')({
  component: ApplicationEntitiesPage,
})