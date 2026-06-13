import type { ModelConfig } from '../../../shared/model-schema';
import type { Column, Field } from '../../types';

const columns: Column[] = [
  { key: 'code', label: 'Code' },
  { key: 'name', label: 'Name' },
  { key: 'isDefault', label: 'Default' },
  { key: 'isActive', label: 'Active' },
];

const createFields: Field[] = [
  { name: 'code', label: 'Code', required: true },
  { name: 'name', label: 'Name', required: true },
  { name: 'isDefault', label: 'Default', type: 'switch', defaultValue: false },
  { name: 'isActive', label: 'Active', type: 'switch', defaultValue: true },
];

function buildUpdatePayload(values: Record<string, unknown>) {
  const { id, createdAt, updatedAt, organizationId, ...rest } = values;
  return { ...rest };
}

export const priceListsConfig: ModelConfig = {
  id: 'price-lists',
  title: 'Price Lists',
  description: 'Create and maintain named pricing policies.',
  endpoint: '/price-lists',
  columns,
  createFields,
  buildUpdatePayload,
  canDelete: true,
};
