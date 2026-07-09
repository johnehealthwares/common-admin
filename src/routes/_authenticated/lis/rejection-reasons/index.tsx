import { createFileRoute } from '@tanstack/react-router';
import { LisRejectionReasonsPage } from '@/features/lis/pages';

export const Route = createFileRoute('/_authenticated/lis/rejection-reasons/')({
  component: LisRejectionReasonsPage,
});
