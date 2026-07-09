import type { Column, FieldGroup, TabGroup } from '@/features/rxsoft/types';
import type { ModelConfig } from '@/features/shared/model-schema';

const columns: Column[] = [
  { key: 'code', label: 'Code' },
  { key: 'name', label: 'Name' },
  { key: 'description', label: 'Description' },
  { key: 'active', label: 'Active' },
];

const tabGroups: TabGroup[] = [
  {
    title: 'Panel Info',
    value: 'panel',
    fieldGroups: [
      {
        title: 'Panel Details',
        fields: [
          { name: 'code', label: 'Code', type: 'text', required: true, col: 4 },
          { name: 'name', label: 'Name', type: 'text', required: true, col: 8 },
          { name: 'description', label: 'Description', type: 'text', col: 12 },
          { name: 'active', label: 'Active', type: 'switch', col: 3 },
          { name: 'testIds', label: 'Tests', type: 'multi-async-select', searchParam: { endpoint: '/lis/test-definitions', valueKey: 'id', labelKey: 'name' }, col: 12 },
        ],
      },
    ],
  },
];

export const panelsConfig: ModelConfig = {
  id: 'panels',
  title: 'Panels',
  description: 'Multitest panels (e.g. CBC, LFT) with embedded test references.',
  endpoint: '/lis/panels',
  columns,
  tabGroups,
  buildCreatePayload: (v) => v,
  buildUpdatePayload: (v) => v,
  canDelete: true,
};
