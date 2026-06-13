import { DataPageShell } from '@/features/components/page/data-page-shell';
import type { ModelConfig } from '@/features/shared/model-schema';
import { exchangePageSchema } from './conversation-page-schemas';

const config: ModelConfig = exchangePageSchema;

export function RxExchangesPage() {
  return <DataPageShell config={config} />;
}
