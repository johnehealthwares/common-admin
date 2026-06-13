import { DataPageShell } from '@/features/components/page/data-page-shell';
import type { ModelConfig } from '@/features/shared/model-schema';
import { participantPageSchema } from './conversation-page-schemas';

const config: ModelConfig = participantPageSchema;

export function RxParticipantsPage() {
  return <DataPageShell config={config} />;
}
