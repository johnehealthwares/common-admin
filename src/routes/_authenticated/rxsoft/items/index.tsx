import { createFileRoute } from '@tanstack/react-router';
import { RxItemsPage } from '@/features/rxsoft/pages';

export const Route = createFileRoute('/_authenticated/rxsoft/items/')({
  component: RxItemsPage,
});
