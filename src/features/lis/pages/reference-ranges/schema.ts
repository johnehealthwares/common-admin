import type { Column, FieldGroup, TabGroup } from '@/features/rxsoft/types';
import type { ModelConfig } from '@/features/shared/model-schema';

const columns: Column[] = [
  { key: 'testDefinitionId', label: 'Test', render: (row: any) => row.test?.name ?? row.testDefinitionId },
  { key: 'gender', label: 'Gender' },
  { key: 'minAge', label: 'Min Age' },
  { key: 'maxAge', label: 'Max Age' },
  { key: 'lowNormal', label: 'Low Normal' },
  { key: 'highNormal', label: 'High Normal' },
  { key: 'active', label: 'Active' },
];

const tabGroups: TabGroup[] = [
  {
    title: 'Reference Range',
    value: 'ref-range',
    fieldGroups: [
      {
        title: 'Range Details',
        fields: [
          { name: 'testDefinitionId', label: 'Test Definition', type: 'async-select', searchParam: { endpoint: '/lis/test-definitions', valueKey: 'id', labelKey: 'name' }, required: true, col: 6 },
          { name: 'gender', label: 'Gender', type: 'select', options: ['M', 'F', 'U'], col: 3 },
          { name: 'active', label: 'Active', type: 'switch', col: 3 },
          { name: 'minAge', label: 'Min Age (days)', type: 'number', col: 3 },
          { name: 'maxAge', label: 'Max Age (days)', type: 'number', col: 3 },
          { name: 'lowNormal', label: 'Low Normal', type: 'text', col: 3 },
          { name: 'highNormal', label: 'High Normal', type: 'text', col: 3 },
          { name: 'lowCritical', label: 'Low Critical', type: 'text', col: 3 },
          { name: 'highCritical', label: 'High Critical', type: 'text', col: 3 },
          { name: 'unitId', label: 'Unit', type: 'async-select', searchParam: { endpoint: '/lis/uoms', valueKey: 'id', labelKey: 'name' }, col: 4 },
        ],
      },
    ],
  },
];

export const referenceRangesConfig: ModelConfig = {
  id: 'reference-ranges',
  title: 'Reference Ranges',
  description: 'Age- and gender-specific normal/critical ranges per test definition.',
  endpoint: '/lis/reference-ranges',
  columns,
  tabGroups,
  buildCreatePayload: (v) => v,
  buildUpdatePayload: (v) => v,
  canDelete: true,
};
