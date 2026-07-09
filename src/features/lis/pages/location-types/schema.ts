import type { Column, Field } from '@/features/rxsoft/types';
import type { ModelConfig } from '@/features/shared/model-schema';

const columns: Column[] = [
  { key: 'name', label: 'Name' },
  { key: 'description', label: 'Description' },
  { key: 'active', label: 'Active' },
];

const createFields: Field[] = [
  { name: 'name', label: 'Name', type: 'text', required: true, col: 6 },
  { name: 'description', label: 'Description', type: 'text', col: 12 },
  { name: 'active', label: 'Active', type: 'switch', col: 3 },
];

export const locationTypesConfig: ModelConfig = {
  id: 'location-types',
  title: 'Location Types',
  description: 'Location and facility type classifications.',
  endpoint: '/lis/location-types',
  columns,
  createFields,
  buildCreatePayload: (v) => v,
  buildUpdatePayload: (v) => v,
  canDelete: true,
};
