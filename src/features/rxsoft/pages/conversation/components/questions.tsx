import { DataPageShell } from '@/features/components/page/data-page-shell';
import type { ModelConfig } from '@/features/shared/model-schema';
import { questionPageSchema } from './conversation-page-schemas';

const config: ModelConfig = questionPageSchema;

export function RxQuestionsPage() {
  return <DataPageShell config={config} />;
}
