import { DataPageShell } from '@/features/components/page/data-page-shell';
import type { ModelConfig } from '@/features/shared/model-schema';
import { workflowInstancePageSchema } from './conversation-page-schemas';

const config: ModelConfig = workflowInstancePageSchema;

export function RxWorkflowInstancesPage() {
  return <DataPageShell config={config} />;
}
