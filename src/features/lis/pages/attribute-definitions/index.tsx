import { DataPageShell } from '@/features/components/page/data-page-shell';
import { attributeDefinitionsConfig } from './schema';

export function LisAttributeDefinitionsPage() {
  return <DataPageShell config={attributeDefinitionsConfig} />;
}
