import { DataPageShell } from '@/features/components/page/data-page-shell';
import { sampleTypesConfig } from './schema';

export function LisSampleTypesPage() {
  return <DataPageShell config={sampleTypesConfig} />;
}
