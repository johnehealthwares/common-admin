import { DataPageShell } from '@/features/components/page/data-page-shell';
import { referenceRangesConfig } from './schema';

export function LisReferenceRangesPage() {
  return <DataPageShell config={referenceRangesConfig} />;
}
