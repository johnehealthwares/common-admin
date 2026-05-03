import { createFileRoute } from '@tanstack/react-router'
import { AuditCenterPage } from '@/features/communication/pages/audit-center'

export const Route = createFileRoute('/_authenticated/communication/audit-center')({
  component: AuditCenterPage,
})
