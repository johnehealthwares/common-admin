import { DataPageShell } from '@/features/components/page/data-page-shell';
import type { ModelConfig } from '@/features/shared/model-schema';
import { workflowEventPageSchema } from './conversation-page-schemas';

const config: ModelConfig = workflowEventPageSchema;

export function RxWorkflowEventsPage() {
  return <DataPageShell config={config} />;
}
