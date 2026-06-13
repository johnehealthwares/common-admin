import { createFileRoute } from '@tanstack/react-router';
import { RxCategoriesPage } from '@/features/rxsoft/pages';

export const Route = createFileRoute('/_authenticated/categories/')({
  component: RxCategoriesPage,
});
