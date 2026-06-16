import { createFileRoute } from '@tanstack/react-router';
import { RxPriceListItemsPage } from '@/features/rxsoft/pages';

export const Route = createFileRoute('/_authenticated/rxsoft/price-list-items/')({
  component: RxPriceListItemsPage,
});
