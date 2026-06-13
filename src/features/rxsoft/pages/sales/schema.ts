import type { ModelConfig } from '../../../shared/model-schema';
import type { Column, Field } from '../../types';

const columns: Column[] = [
  { key: 'id', label: 'ID' },
  { key: 'saleNumber', label: 'Sale #' },
  { key: 'saleChannel', label: 'Channel' },
  { key: 'storeId', label: 'Store' },
  { key: 'totalAmount', label: 'Total' },
  { key: 'status', label: 'Status' },
  { key: 'saleDate', label: 'Date' },
];

const createFields: Field[] = [
  { name: 'saleNumber', label: 'Sale Number', required: true },
  { name: 'saleChannel', label: 'Sale Channel', required: true, placeholder: 'pos' },
  { name: 'storeId', label: 'Store ID', required: true },
  { name: 'customerId', label: 'Customer ID' },
  {
    name: 'linesJson',
    label: 'Lines JSON',
    required: true,
    type: 'textarea',
    placeholder: '[{"productId":"...","uomId":"...","quantity":1,"unitPrice":10}]',
  },
  {
    name: 'paymentsJson',
    label: 'Payments JSON',
    required: true,
    type: 'textarea',
    placeholder: '[{"paymentMethodId":"...","amount":10}]',
  },
];

function buildCreatePayload(values: Record<string, unknown>) {
  return {
    saleNumber: values.saleNumber,
    saleChannel: values.saleChannel,
    storeId: values.storeId,
    customerId: values.customerId || undefined,
    lines: JSON.parse(String(values.linesJson ?? '[]')),
    payments: JSON.parse(String(values.paymentsJson ?? '[]')),
  };
}

export const salesConfig: ModelConfig = {
  id: 'sales',
  title: 'Sales',
  description: 'Review sales, refunds, payment filters and operational drill-down.',
  endpoint: '/sales',
  columns,
  createFields,
  buildCreatePayload,
  canDelete: true,
};
