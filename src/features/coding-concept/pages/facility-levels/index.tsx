import { DataPageShell } from '@/features/components/page/data-page-shell';
import { codingConceptApi } from '@/lib/coding-concept-api';
import { facilityLevelsConfig } from './schema';

export function CodedFacilityLevelsPage() {
  return <DataPageShell config={{ ...facilityLevelsConfig, apiProvider: codingConceptApi }} />;
}
