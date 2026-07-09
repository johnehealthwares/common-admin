import { DataPageShell } from '@/features/components/page/data-page-shell';
import { resultsConfig } from './schema';

export function LisResultsPage() {
  return <DataPageShell config={resultsConfig} />;
}
