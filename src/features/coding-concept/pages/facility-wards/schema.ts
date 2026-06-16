import type { ModelConfig } from '@/features/shared/model-schema';
import type { Column } from '@/features/rxsoft/types';

const columns: Column[] = [
  { key: 'code', label: 'Code' },
  { key: 'name', label: 'Name' },
  { key: 'lgaCode', label: 'LGA Code' },
];

export const facilityWardsConfig: ModelConfig = {
  id: 'facility-wards',
  title: 'Wards',
  description: 'View ward reference data.',
  endpoint: '/facilities/wards',
  columns,
};
