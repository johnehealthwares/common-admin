import { createFileRoute } from '@tanstack/react-router';
import { LisStatusesPage } from '@/features/lis/pages';

export const Route = createFileRoute('/_authenticated/lis/statuses/')({
  component: LisStatusesPage,
});
