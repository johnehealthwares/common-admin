import { createFileRoute } from '@tanstack/react-router';
import { LisPrioritiesPage } from '@/features/lis/pages';

export const Route = createFileRoute('/_authenticated/lis/priorities/')({
  component: LisPrioritiesPage,
});
