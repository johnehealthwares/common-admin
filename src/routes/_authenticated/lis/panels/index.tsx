import { createFileRoute } from '@tanstack/react-router';
import { LisPanelsPage } from '@/features/lis/pages';

export const Route = createFileRoute('/_authenticated/lis/panels/')({
  component: LisPanelsPage,
});
