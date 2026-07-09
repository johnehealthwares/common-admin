import { createFileRoute } from '@tanstack/react-router';
import { LisMethodsPage } from '@/features/lis/pages';

export const Route = createFileRoute('/_authenticated/lis/methods/')({
  component: LisMethodsPage,
});
