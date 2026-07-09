import { DataPageShell } from '@/features/components/page/data-page-shell';
import { testCategoriesConfig } from './schema';

export function LisTestCategoriesPage() {
  return <DataPageShell config={testCategoriesConfig} />;
}
