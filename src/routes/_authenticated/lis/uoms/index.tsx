import { createFileRoute } from '@tanstack/react-router';
import { LisUomsPage } from '@/features/lis/pages';

export const Route = createFileRoute('/_authenticated/lis/uoms/')({
  component: LisUomsPage,
});
