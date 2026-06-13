import type { ModelConfig } from '../../../shared/model-schema';
import type { Column } from '../../types';

const columns: Column[] = [
  { key: 'name', label: 'Name' },
  { key: 'phone', label: 'Phone' },
  { key: 'email', label: 'Email' },
  { key: 'status', label: 'Status' },
  { key: 'createdAt', label: 'Date' },
];

export const prescriptionsConfig: ModelConfig = {
  id: 'website-prescriptions',
  title: 'Prescriptions',
  description: 'View prescription submissions from the Damorex website.',
  endpoint: '/website/admin/prescriptions',
  columns,
  canDelete: false,
};
