import { DataPageShell } from '@/features/components/page/data-page-shell';
import type { ModelConfig } from '@/features/shared/model-schema';
import { workflowPageSchema } from './conversation-page-schemas';

const config: ModelConfig = workflowPageSchema;

export function RxWorkflowsPage() {
  return <DataPageShell config={config} />;
}
