import type { ModelConfig } from '../../../shared/model-schema';
import { type Column, type Field, type TabGroup } from '../../types';

const columns: Column[] = [
  { key: 'id', label: 'ID' },
  { key: 'username', label: 'Username' },
  {
    key: 'roles',
    label: 'Roles',
    render: (row) => ((row.roles as string[] | undefined) ?? []).join(', '),
  },
];

const userCreateFields: Field[] = [
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

const posConfigFields: Field[] = [
  {
    name: 'storeId',
    label: 'Store ID',
    placeholder: 'default',
    col: 6,
  },
  {
    name: 'stockLocationId',
    label: 'Stock Location',
    type: 'async-select',
    searchParam: {
      endpoint: '/stock-locations',
      queryParam: 'search',
      valueKey: 'id',
      labelKey: 'name',
      minChars: 0,
    },
    col: 6,
  },
  {
    name: 'loginTimeoutMinutes',
    label: 'Login Timeout (minutes)',
    type: 'number',
    placeholder: '480',
    col: 4,
  },
  {
    name: 'allowPos',
    label: 'Allow POS',
    type: 'switch',
    defaultValue: true,
    col: 4,
  },
  {
    name: 'allowA4Print',
    label: 'Allow A4 Print',
    type: 'switch',
    defaultValue: false,
    col: 4,
  },
];

const tabGroups: TabGroup[] = [
  {
    title: 'User Details',
    value: 'user-details',
    fieldGroups: [{ fields: userCreateFields }],
  },
  {
    title: 'POS Config',
    value: 'pos-config',
    fieldGroups: [{ fields: posConfigFields }],
  },
];

function buildCreatePayload(values: Record<string, unknown>) {
  return {
    username: values.username,
    password: values.password,
    roleCodes: Array.isArray(values.roleCodes)
      ? values.roleCodes.map((item: any) => (typeof item === 'string' ? item : item.value ?? item.code ?? ''))
      : [],
    posConfig: {
      storeId: values.storeId || undefined,
      stockLocationId: values.stockLocationId
        ? (values.stockLocationId as { value: string }).value
        : undefined,
      allowPos: values.allowPos ?? true,
      allowA4Print: values.allowA4Print ?? false,
      loginTimeoutMinutes: values.loginTimeoutMinutes ? Number(values.loginTimeoutMinutes) : undefined,
    },
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
  payload.posConfig = {
    storeId: values.storeId || undefined,
    stockLocationId: values.stockLocationId
      ? (values.stockLocationId as { value: string }).value
      : undefined,
    allowPos: values.allowPos ?? true,
    allowA4Print: values.allowA4Print ?? false,
    loginTimeoutMinutes: values.loginTimeoutMinutes ? Number(values.loginTimeoutMinutes) : undefined,
  };
  return payload;
}

function buildFormState(row: Record<string, unknown>) {
  const formState = { ...row };
  const posConfig = row.posConfig as Record<string, unknown> | undefined;
  if (posConfig) {
    if (posConfig.stockLocationId) {
      const loc = posConfig.stockLocation as { id?: string; name?: string } | undefined;
      formState.stockLocationId = loc?.id
        ? { value: loc.id, label: loc.name ?? loc.id }
        : posConfig.stockLocationId;
    }
    if (posConfig.storeId) {
      formState.storeId = posConfig.storeId;
    }
    if (posConfig.allowPos !== undefined) {
      formState.allowPos = posConfig.allowPos;
    }
    if (posConfig.allowA4Print !== undefined) {
      formState.allowA4Print = posConfig.allowA4Print;
    }
    if (posConfig.loginTimeoutMinutes) {
      formState.loginTimeoutMinutes = posConfig.loginTimeoutMinutes;
    }
  }
  return formState;
}

export const usersConfig: ModelConfig = {
  id: 'users',
  title: 'Users',
  description: 'User lifecycle management, activation, assignment and traceability.',
  endpoint: '/users',
  columns,
  tabGroups,
  buildCreatePayload,
  buildUpdatePayload,
  buildFormState,
  canDelete: true,
};
