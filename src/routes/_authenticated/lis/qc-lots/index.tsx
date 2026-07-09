import { createFileRoute } from '@tanstack/react-router';
import { LisQcLotsPage } from '@/features/lis/pages';

export const Route = createFileRoute('/_authenticated/lis/qc-lots/')({
  component: LisQcLotsPage,
});
