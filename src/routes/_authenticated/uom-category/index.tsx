import { createFileRoute } from '@tanstack/react-router';
import { RxUomCategoryPage } from '@/features/rxsoft/pages/uom-category';

export const Route = createFileRoute('/_authenticated/uom-category/')({
  component: RxUomCategoryPage,
});
