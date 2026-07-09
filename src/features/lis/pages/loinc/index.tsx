import { DataPageShell } from '@/features/components/page/data-page-shell';
import { loincConfig } from './schema';

export function LisLoincPage() {
  return <DataPageShell config={loincConfig} />;
}
