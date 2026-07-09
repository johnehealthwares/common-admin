import { createFileRoute } from '@tanstack/react-router';
import { LisResultSignaturesPage } from '@/features/lis/pages';

export const Route = createFileRoute('/_authenticated/lis/result-signatures/')({
  component: LisResultSignaturesPage,
});
