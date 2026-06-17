import { createFileRoute } from '@tanstack/react-router';
import { ResultsPage } from '@/features/apm/admin/ResultsPage';

export const Route = createFileRoute('/apm/admin/results')({
  component: ResultsPage,
});
