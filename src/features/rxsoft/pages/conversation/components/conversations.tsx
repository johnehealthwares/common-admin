import { DataPageShell } from '@/features/components/page/data-page-shell';
import type { ModelConfig } from '@/features/shared/model-schema';
import { conversationPageSchema } from './conversation-page-schemas';

const config: ModelConfig = conversationPageSchema;

export function RxConversationsPage() {
  return <DataPageShell config={config} />;
}
