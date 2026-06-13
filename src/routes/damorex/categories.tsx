import { createFileRoute } from '@tanstack/react-router';
import CategoriesPage from '@/features/damorex/categories/page';

export const Route = createFileRoute('/damorex/categories')({
  component: CategoriesPage,
});
