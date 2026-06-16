import type { ModelConfig } from '../../../shared/model-schema';
import type { Column, Field } from '../../types';

const columns: Column[] = [
  { key: 'id', label: 'ID' },
  { key: 'username', label: 'Username' },
  {
    key: 'roles',
    label: 'Roles',
    render: (row) => ((row.roles as string[] | undefined) ?? []).join(', '),
  },
];

const createFields: Field[] = [
  { name: 'username', label: 'Username', required: true },
  { name: 'password', label: 'Password', type: 'password', required: true },
  {
    name: 'roleCodes',
    label: 'Roles',
    type: 'multi-async-select' as any,
    required: true,
    searchParam: {
      endpoint: '/roles',
      queryParam: 'search',
      valueKey: 'code',
      labelKey: 'name',
      minChars: 0,
    },
  },
];

function buildCreatePayload(values: Record<string, unknown>) {
  return {
    username: values.username,
    password: values.password,
    roleCodes: Array.isArray(values.roleCodes)
      ? values.roleCodes.map((item: any) => (typeof item === 'string' ? item : item.value ?? item.code ?? ''))
      : [],
  };
}

function buildUpdatePayload(values: Record<string, unknown>, _row?: Record<string, unknown>) {
  const payload: Record<string, unknown> = {};
  if (values.username) payload.username = values.username;
  if (values.password) payload.password = values.password;
  if (values.roleCodes) {
    payload.roleCodes = Array.isArray(values.roleCodes)
      ? values.roleCodes.map((item: any) => (typeof item === 'string' ? item : item.value ?? item.code ?? ''))
      : [];
  }
  return payload;
}

export const usersConfig: ModelConfig = {
  id: 'users',
  title: 'Users',
  description: 'User lifecycle management, activation, assignment and traceability.',
  endpoint: '/users',
  columns,
  createFields,
  buildCreatePayload,
  buildUpdatePayload,
  canDelete: true,
};
