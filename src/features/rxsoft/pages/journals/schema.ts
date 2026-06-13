import type { ModelConfig } from '../../../shared/model-schema';
import type { Column, Field } from '../../types';

const columns: Column[] = [
  { key: 'code', label: 'Code' },
  { key: 'name', label: 'Name' },
  { key: 'journalType', label: 'Type' },
  { key: 'isActive', label: 'Active' },
];

const createFields: Field[] = [
  { name: 'code', label: 'Code', required: true },
  { name: 'name', label: 'Name', required: true },
  { name: 'journalType', label: 'Journal Type', required: true, placeholder: 'general' },
  { name: 'defaultDebitAccountId', label: 'Default Debit Account ID' },
  { name: 'defaultCreditAccountId', label: 'Default Credit Account ID' },
  { name: 'isActive', label: 'Active', type: 'switch', defaultValue: true },
];

function buildCreatePayload(values: Record<string, unknown>) {
  return {
    code: values.code,
    name: values.name,
    journalType: values.journalType,
    defaultDebitAccountId: values.defaultDebitAccountId || undefined,
    defaultCreditAccountId: values.defaultCreditAccountId || undefined,
    isActive: values.isActive,
  };
}

export const journalsConfig: ModelConfig = {
  id: 'journals',
  title: 'Journals',
  description: 'Accounting journals for sales, purchases, cash, banks and general entries.',
  endpoint: '/journals',
  columns,
  createFields,
  buildCreatePayload,
  canDelete: true,
};
