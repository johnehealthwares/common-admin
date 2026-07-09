import { DataPageShell } from '@/features/components/page/data-page-shell';
import { locationsConfig } from './schema';

export function LisLocationsPage() {
  return <DataPageShell config={locationsConfig} />;
}
