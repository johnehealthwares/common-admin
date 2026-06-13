import { createFileRoute } from '@tanstack/react-router';
import CategoryProductsPage from '@/features/damorex/categories/category';

export const Route = createFileRoute('/damorex/categories/$slug')({
  component: CategoryProductsPage,
});
