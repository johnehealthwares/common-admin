import { createFileRoute } from '@tanstack/react-router';
import { LisProgramsPage } from '@/features/lis/pages';

export const Route = createFileRoute('/_authenticated/lis/programs/')({
  component: LisProgramsPage,
});
