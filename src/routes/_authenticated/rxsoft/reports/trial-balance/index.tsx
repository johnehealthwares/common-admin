import { createFileRoute } from '@tanstack/react-router';
import { TrialBalancePage } from '@/features/rxsoft/pages/trial-balance';

export const Route = createFileRoute('/_authenticated/rxsoft/reports/trial-balance/')({
  component: TrialBalancePage,
});
