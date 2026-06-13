import type { ModelConfig } from '../../../shared/model-schema';
import type { Column, Field } from '../../types';

const columns: Column[] = [
  { key: 'name', label: 'Name' },
  { key: 'updatedAt', label: 'Updated' },
];

const createFields: Field[] = [{ name: 'name', label: 'Name', required: true }];

function buildCreatePayload(values: Record<string, unknown>) {
  return { name: values.name };
}

export const drugComponentsConfig: ModelConfig = {
  id: 'drug-components',
  title: 'Drug Components',
  description: 'Manage active ingredients and component lookup values.',
  endpoint: '/drug-components',
  columns,
  createFields,
  buildCreatePayload,
  canExport: true,
  csvEndpoint: '/drug-components/export',
};
