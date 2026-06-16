import type { ModelConfig } from '@/features/shared/model-schema';
import type { Column } from '@/features/rxsoft/types';

const columns: Column[] = [
  { key: 'code', label: 'Code' },
  { key: 'name', label: 'Name' },
];

export const facilityTypesConfig: ModelConfig = {
  id: 'facility-types',
  title: 'Facility Types',
  description: 'View facility type reference data.',
  endpoint: '/facilities/types',
  columns,
};
