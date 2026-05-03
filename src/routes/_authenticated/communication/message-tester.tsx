import { createFileRoute } from '@tanstack/react-router'
import { MessageTesterPage } from '@/features/communication/pages/message-tester'

export const Route = createFileRoute('/_authenticated/communication/message-tester')({
  component: MessageTesterPage,
})
