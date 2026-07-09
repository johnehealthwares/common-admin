import { DataPageShell } from '@/features/components/page/data-page-shell';
import { methodsConfig } from './schema';

export function LisMethodsPage() {
  return <DataPageShell config={methodsConfig} />;
}
