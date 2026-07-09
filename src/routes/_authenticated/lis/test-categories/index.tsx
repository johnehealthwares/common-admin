import { createFileRoute } from '@tanstack/react-router';
import { LisTestCategoriesPage } from '@/features/lis/pages';

export const Route = createFileRoute('/_authenticated/lis/test-categories/')({
  component: LisTestCategoriesPage,
});
