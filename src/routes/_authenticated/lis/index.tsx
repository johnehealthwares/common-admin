import { createFileRoute } from '@tanstack/react-router';
import { LisPage } from '@/features/lis/pages';

export const Route = createFileRoute('/_authenticated/lis/')({
  component: LisPage,
});
