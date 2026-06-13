import { DataPageShell } from '@/features/components/page/data-page-shell';
import type { ModelConfig } from '@/features/shared/model-schema';
import { questionnairePageSchema } from './conversation-page-schemas';

const config: ModelConfig = questionnairePageSchema;

export function RxQuestionnairesPage() {
  return <DataPageShell config={config} />;
}
