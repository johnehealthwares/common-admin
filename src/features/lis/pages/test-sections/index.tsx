import { DataPageShell } from '@/features/components/page/data-page-shell';
import { testSectionsConfig } from './schema';

export function LisTestSectionsPage() {
  return <DataPageShell config={testSectionsConfig} />;
}
