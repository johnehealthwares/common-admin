import type { Column, FieldGroup, TabGroup } from '@/features/rxsoft/types';
import type { ModelConfig } from '@/features/shared/model-schema';

const columns: Column[] = [
  { key: 'code', label: 'Code' },
  { key: 'name', label: 'Name' },
  { key: 'testSectionId', label: 'Section', render: (row: any) => row.testSection?.name ?? row.testSectionId },
  { key: 'active', label: 'Active' },
];

const tabGroups: TabGroup[] = [
  {
    title: 'Test Definition',
    value: 'test-def',
    fieldGroups: [
      {
        title: 'Basic Information',
        fields: [
          { name: 'code', label: 'Code', type: 'text', required: true, col: 4 },
          { name: 'name', label: 'Name', type: 'text', required: true, col: 8 },
          { name: 'description', label: 'Description', type: 'text', col: 12 },
          { name: 'active', label: 'Active', type: 'switch', col: 3 },
        ],
      },
      {
        title: 'Classification',
        fields: [
          { name: 'testSectionId', label: 'Test Section', type: 'async-select', searchParam: { endpoint: '/lis/test-sections', valueKey: 'id', labelKey: 'name' }, col: 4 },
          { name: 'testCategoryId', label: 'Test Category', type: 'async-select', searchParam: { endpoint: '/lis/test-categories', valueKey: 'id', labelKey: 'name' }, col: 4 },
          { name: 'methodId', label: 'Method', type: 'async-select', searchParam: { endpoint: '/lis/methods', valueKey: 'id', labelKey: 'name' }, col: 4 },
          { name: 'sampleTypeId', label: 'Sample Type', type: 'async-select', searchParam: { endpoint: '/lis/sample-types', valueKey: 'id', labelKey: 'name' }, col: 4 },
          { name: 'priorityId', label: 'Priority', type: 'async-select', searchParam: { endpoint: '/lis/priorities', valueKey: 'id', labelKey: 'name' }, col: 4 },
          { name: 'programId', label: 'Program', type: 'async-select', searchParam: { endpoint: '/lis/programs', valueKey: 'id', labelKey: 'name' }, col: 4 },
        ],
      },
      {
        title: 'Result Configuration',
        fields: [
          { name: 'unitId', label: 'Unit', type: 'async-select', searchParam: { endpoint: '/lis/uoms', valueKey: 'id', labelKey: 'name' }, col: 4 },
          { name: 'loincIds', label: 'LOINC Codes', type: 'multi-async-select', searchParam: { endpoint: '/lis/loinc', valueKey: 'id', labelKey: 'code' }, col: 8 },
          { name: 'reportable', label: 'Reportable', type: 'switch', col: 3 },
          { name: 'displayOrder', label: 'Display Order', type: 'number', col: 3 },
        ],
      },
    ],
  },
];

export const testDefinitionsConfig: ModelConfig = {
  id: 'test-definitions',
  title: 'Test Definitions',
  description: 'Individual lab test definitions with LOINC, method, category, and unit mappings.',
  endpoint: '/lis/test-definitions',
  columns,
  tabGroups,
  buildCreatePayload: (v) => v,
  buildUpdatePayload: (v) => v,
  canDelete: true,
};
