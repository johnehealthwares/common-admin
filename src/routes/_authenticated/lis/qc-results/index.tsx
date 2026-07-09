import { createFileRoute } from '@tanstack/react-router';
import { LisQcResultsPage } from '@/features/lis/pages';

export const Route = createFileRoute('/_authenticated/lis/qc-results/')({
  component: LisQcResultsPage,
});
