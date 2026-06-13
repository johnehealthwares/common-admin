import { createFileRoute } from '@tanstack/react-router';
import { RxReportsPage } from '@/features/rxsoft/pages';

export const Route = createFileRoute('/_authenticated/reports/')({
  component: RxReportsPage,
});
