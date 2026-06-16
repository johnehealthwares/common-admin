import { createFileRoute } from '@tanstack/react-router';
import { RxReportsPage } from '@/features/rxsoft/pages';

export const Route = createFileRoute('/_authenticated/rxsoft/reports/')({
  component: RxReportsPage,
});
