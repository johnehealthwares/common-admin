import { DataPageShell } from '@/features/components/page/data-page-shell';
import { testDefinitionsConfig } from './schema';

export function LisTestDefinitionsPage() {
  return <DataPageShell config={testDefinitionsConfig} />;
}
