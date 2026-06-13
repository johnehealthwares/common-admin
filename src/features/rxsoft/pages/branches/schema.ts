import type { ModelConfig } from '../../../shared/model-schema';
import type { Column, Field, TabGroup } from '../../types';

const columns: Column[] = [
  { key: 'code', label: 'Code' },
  { key: 'name', label: 'Name' },
  { key: 'address', label: 'Address' },
  { key: 'updatedAt', label: 'Updated' },
];

const tabGroups: TabGroup[] = [
  {
    title: 'General Info',
    value: 'general',
    fieldGroups: [
      {
        fields: [
          { name: 'code', label: 'Code', required: true, placeholder: 'MAIN' },
          { name: 'name', label: 'Name', required: true, placeholder: 'Main Branch' },
          { name: 'address', label: 'Address' },
        ],
      },
    ],
  },
];

function buildCreatePayload(values: Record<string, unknown>) {
  return {
    code: values.code,
    name: values.name,
    address: values.address || undefined,
  };
}

function buildUpdatePayload(values: Record<string, unknown>) {
  return {
    code: values.code,
    name: values.name,
    address: values.address || undefined,
  };
}

export const branchesConfig: ModelConfig = {
  id: 'branches',
  title: 'Branches',
  description: 'Branch/store setup and activation controls for multi-location operations.',
  endpoint: '/branches',
  columns,
  tabGroups,
  buildCreatePayload,
  buildUpdatePayload,
};
