import { createFileRoute } from '@tanstack/react-router'
import { BroadcastsPage } from '@/features/communication/components/broadcasts'

export const Route = createFileRoute('/_authenticated/broadcasts')({
  component: BroadcastsPage,
})