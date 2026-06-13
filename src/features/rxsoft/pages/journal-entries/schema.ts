import type { ModelConfig } from '../../../shared/model-schema';
import type { Column, Field } from '../../types';

const columns: Column[] = [
  { key: 'entryNumber', label: 'Entry Number' },
  { key: 'journalId', label: 'Journal' },
  { key: 'entryDate', label: 'Entry Date' },
  { key: 'status', label: 'Status' },
  {
    key: 'lines',
    label: 'Lines',
    render: (row) => String(((row.lines as unknown[]) ?? []).length),
  },
];

const createFields: Field[] = [
  { name: 'journalId', label: 'Journal ID', required: true },
  { name: 'entryNumber', label: 'Entry Number', required: true },
  { name: 'entryDate', label: 'Entry Date', required: true, placeholder: '2026-04-02' },
  { name: 'reference', label: 'Reference' },
  { name: 'sourceType', label: 'Source Type' },
  { name: 'sourceId', label: 'Source ID' },
  { name: 'status', label: 'Status', placeholder: 'draft' },
];

function buildCreatePayload(values: Record<string, unknown>) {
  return {
    journalId: values.journalId,
    entryNumber: values.entryNumber,
    entryDate: values.entryDate,
    reference: values.reference || undefined,
    sourceType: values.sourceType || undefined,
    sourceId: values.sourceId || undefined,
    status: values.status || undefined,
  };
}

export const journalEntriesConfig: ModelConfig = {
  id: 'journal-entries',
  title: 'Journal Entries',
  description: 'Header-level accounting postings.',
  endpoint: '/journal-entries',
  columns,
  createFields,
  buildCreatePayload,
  canDelete: true,
};
