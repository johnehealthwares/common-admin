import { DataPageShell } from '@/features/components/page/data-page-shell';
import { ordersConfig } from './schema';

export function LisOrdersPage() {
  return <DataPageShell config={ordersConfig} />;
}
