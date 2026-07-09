import { DataPageShell } from '@/features/components/page/data-page-shell';
import type { ModelConfig } from '@/features/shared/model-schema';
import { projectionPageSchema } from './conversation-page-schemas';

const config: ModelConfig = projectionPageSchema;

export function RxProjectionsPage() {
  return <DataPageShell config={config} />;
}
