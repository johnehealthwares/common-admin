import type { ModelConfig } from '../../../shared/model-schema';
import type { Column, Field } from '../../types';

const columns: Column[] = [
  { key: 'name', label: 'Name' },
  { key: 'phone', label: 'Phone' },
  { key: 'email', label: 'Email' },
  { key: 'addressLine1', label: 'Address' },
  { key: 'updatedAt', label: 'Updated' },
];

const createFields: Field[] = [
  { name: 'name', label: 'Name', required: true },
  { name: 'phone', label: 'Phone' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'address', label: 'Address' },
];

function buildCreatePayload(values: Record<string, unknown>) {
  return {
    name: values.name,
    phone: values.phone || undefined,
    email: values.email || undefined,
    address: values.address || undefined,
  };
}

export const customersConfig: ModelConfig = {
  id: 'customers',
  title: 'Customers',
  description: 'Maintain customer records and account-level visibility.',
  endpoint: '/customers',
  columns,
  createFields,
  buildCreatePayload,
  canExport: true,
  csvEndpoint: '/customers/export',
};
