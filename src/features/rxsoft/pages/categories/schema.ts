import type { ModelConfig } from '../../../shared/model-schema';
import type { Column, Field } from '../../types';

const columns: Column[] = [
  { key: 'code', label: 'Code' },
  { key: 'name', label: 'Name' },
  { key: 'parentId', label: 'Parent' },
];

const createFields: Field[] = [
  { name: 'code', label: 'Code', required: true, placeholder: 'ANALGESICS' },
  { name: 'name', label: 'Name', required: true, placeholder: 'Analgesics' },
  {
    name: 'parentId',
    label: 'Parent ID',
    type: 'async-select',
    searchParam: { endpoint: 'categories', minChars: 2 },
    required: true,
    col: 12,
  },
];

function buildCreatePayload(values: Record<string, unknown>) {
  return { code: values.code, name: values.name, parentId: values.parentId || undefined };
}

export const categoriesConfig: ModelConfig = {
  id: 'categories',
  title: 'Categories',
  description: 'Manage product categories with pagination, sorting, filtering and export.',
  endpoint: '/categories',
  columns,
  createFields,
  buildCreatePayload,
  canDelete: true,
  canExport: true,
  csvEndpoint: '/categories/export',
};
