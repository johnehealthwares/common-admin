import { DataPageShell } from '@/features/components/page/data-page-shell';
import { qcLotsConfig } from './schema';

export function LisQcLotsPage() {
  return <DataPageShell config={qcLotsConfig} />;
}
