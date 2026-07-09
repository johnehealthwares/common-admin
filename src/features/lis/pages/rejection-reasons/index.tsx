import { DataPageShell } from '@/features/components/page/data-page-shell';
import { rejectionReasonsConfig } from './schema';

export function LisRejectionReasonsPage() {
  return <DataPageShell config={rejectionReasonsConfig} />;
}
