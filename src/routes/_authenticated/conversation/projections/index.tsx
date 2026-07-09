import { createFileRoute } from '@tanstack/react-router';
import { RxProjectionsPage } from '@/features/rxsoft/pages';

export const Route = createFileRoute('/_authenticated/conversation/projections/')({
  component: RxProjectionsPage,
});
