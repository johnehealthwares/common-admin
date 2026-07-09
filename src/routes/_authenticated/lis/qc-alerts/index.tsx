import { createFileRoute } from '@tanstack/react-router';
import { LisQcAlertsPage } from '@/features/lis/pages';

export const Route = createFileRoute('/_authenticated/lis/qc-alerts/')({
  component: LisQcAlertsPage,
});
