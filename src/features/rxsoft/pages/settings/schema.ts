import type { ModelConfig } from '../../../shared/model-schema';
import type { Column, Field } from '../../types';

const columns: Column[] = [
  { key: 'key', label: 'Key' },
  { key: 'value', label: 'Value' },
  { key: 'description', label: 'Description' },
  { key: 'updatedAt', label: 'Updated' },
];

const createFields: Field[] = [
  { name: 'key', label: 'Key', required: true, placeholder: 'store.name' },
  { name: 'value', label: 'Value', required: true },
  { name: 'description', label: 'Description' },
];

function buildCreatePayload(values: Record<string, unknown>) {
  return {
    key: values.key,
    value: values.value,
    description: values.description || undefined,
  };
}

export const settingsConfig: ModelConfig = {
  id: 'settings',
  title: 'Settings',
  description: 'Store, tax, currency, payment and platform configuration.',
  endpoint: '/settings',
  columns,
  createFields,
  buildCreatePayload,
};
