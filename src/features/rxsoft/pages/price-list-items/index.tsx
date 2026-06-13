import { DataPageShell } from '@/features/components/page/data-page-shell';
import { priceListItemsConfig } from './schema';

export function RxPriceListItemsPage() {
  return <DataPageShell config={priceListItemsConfig} />;
}
