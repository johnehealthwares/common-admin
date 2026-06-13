import { DataPageShell } from '../../../components/page/data-page-shell';
import { salesConfig } from './schema';

export function RxSalesPage() {
  return <DataPageShell config={salesConfig} />;
}
