import { DataPageShell } from '@/features/components/page/data-page-shell';
import { qcResultsConfig } from './schema';

export function LisQcResultsPage() {
  return <DataPageShell config={qcResultsConfig} />;
}
