import { createFileRoute } from '@tanstack/react-router';
import { RxAuditLogsPage } from '@/features/rxsoft/pages';

export const Route = createFileRoute('/_authenticated/rxsoft/audit-logs/')({
  component: RxAuditLogsPage,
});
