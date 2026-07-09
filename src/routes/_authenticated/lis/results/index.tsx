import { createFileRoute } from '@tanstack/react-router';
import { LisResultsPage } from '@/features/lis/pages';

export const Route = createFileRoute('/_authenticated/lis/results/')({
  component: LisResultsPage,
});
