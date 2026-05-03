import { createFileRoute } from '@tanstack/react-router'
import { NotificationsPage } from '@/features/communication/components/notifications'

export const Route = createFileRoute('/_authenticated/notifications')({
  component: NotificationsPage,
})