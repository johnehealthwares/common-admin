import { DataPageShell } from '@/features/components/page/data-page-shell';
import type { ModelConfig } from '@/features/shared/model-schema';
import { channelPageSchema } from './conversation-page-schemas';

const config: ModelConfig = channelPageSchema;

export function RxChannelsPage() {
  return <DataPageShell config={config} />;
}
