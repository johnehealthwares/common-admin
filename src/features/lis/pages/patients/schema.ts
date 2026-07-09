import type { Column } from '@/features/rxsoft/types';
import type { ModelConfig } from '@/features/shared/model-schema';

const columns: Column[] = [
  { key: 'patientId', label: 'MRN' },
  { key: 'patientName', label: 'Name' },
  { key: 'patientGender', label: 'Gender' },
  { key: 'patientDateOfBirth', label: 'DOB' },
  { key: 'internalReference', label: 'Internal Ref' },
  { key: 'externalReference', label: 'External Ref' },
];

export const patientsConfig: ModelConfig = {
  id: 'patients',
  title: 'Patients',
  description: 'Patient records derived from lab orders (read-only).',
  endpoint: '/lis/patients',
  columns,
  canCreate: false,
  canEdit: false,
  canDelete: false,
  buildCreatePayload: (v) => v,
  buildUpdatePayload: (v) => v,
};
