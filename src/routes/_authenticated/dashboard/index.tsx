import { createFileRoute } from '@tanstack/react-router';
import { RxDashboardPage } from '@/features/rxsoft/pages';

export const Route = createFileRoute('/_authenticated/dashboard/')({
  component: RxDashboardPage,
});
