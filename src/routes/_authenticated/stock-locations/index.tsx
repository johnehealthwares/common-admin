import { createFileRoute } from '@tanstack/react-router';
import {} from '@/features/rxsoft/pages';
import { RxStockLocationPage } from '@/features/rxsoft/pages/stock-locations';

export const Route = createFileRoute('/_authenticated/stock-locations/')({
  component: RxStockLocationPage,
});
