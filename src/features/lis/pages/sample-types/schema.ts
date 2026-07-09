import type { Column, FieldGroup } from '@/features/rxsoft/types';
import type { ModelConfig } from '@/features/shared/model-schema';

const columns: Column[] = [
  { key: 'key', label: 'Key' },
  { key: 'name', label: 'Name' },
  { key: 'accessionCode', label: 'Accession' },
  { key: 'active', label: 'Active' },
];

const createFieldGroups: FieldGroup[] = [
  {
    title: 'Sample Type Details',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, col: 6 },
      { name: 'key', label: 'Key', type: 'text', col: 3 },
      { name: 'accessionCode', label: 'Accession Code', type: 'text', required: true, col: 3 },
      { name: 'description', label: 'Description', type: 'text', col: 12 },
      { name: 'active', label: 'Active', type: 'switch', col: 3 },
    ],
  },
];

export const sampleTypesConfig: ModelConfig = {
  id: 'sample-types',
  title: 'Sample Types',
  description: 'Sample type master data and accession code fragments.',
  endpoint: '/lis/sample-types',
  columns,
  createFieldGroups,
  buildCreatePayload: (v) => v,
  buildUpdatePayload: (v) => v,
  canDelete: true,
};
