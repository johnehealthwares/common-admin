import { DataPageShell } from '@/features/components/page/data-page-shell';
import { qcAlertsConfig } from './schema';

export function LisQcAlertsPage() {
  return <DataPageShell config={qcAlertsConfig} />;
}
