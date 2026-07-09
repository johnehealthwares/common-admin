import { createFileRoute } from '@tanstack/react-router';
import { LisReferenceRangesPage } from '@/features/lis/pages';

export const Route = createFileRoute('/_authenticated/lis/reference-ranges/')({
  component: LisReferenceRangesPage,
});
