import type { ModelConfig } from '@/features/shared/model-schema';
import type { Column, Field } from '@/features/rxsoft/types';

const columns: Column[] = [
  { key: 'code', label: 'Code' },
  { key: 'name', label: 'Name' },
  { key: 'therapeuticClass', label: 'Therapeutic Class' },
  { key: 'dosageForm', label: 'Dosage Form' },
  { key: 'strength', label: 'Strength' },
  { key: 'updatedAt', label: 'Updated' },
];

const createFields: Field[] = [
  { name: 'code', label: 'Code', required: true },
  { name: 'name', label: 'Name', required: true },
  { name: 'therapeuticClass', label: 'Therapeutic Class' },
  { name: 'dosageForm', label: 'Dosage Form' },
  { name: 'strength', label: 'Strength' },
  { name: 'generalUse', label: 'General Use' },
  { name: 'adultDosage', label: 'Adult Dosage' },
  { name: 'pediatricDosage', label: 'Pediatric Dosage' },
  { name: 'isPrescriptionRequired', label: 'Prescription Required', type: 'switch' },
  { name: 'isControlledSubstance', label: 'Controlled Substance', type: 'switch' },
];

function buildCreatePayload(values: Record<string, unknown>) {
  return {
    code: values.code,
    name: values.name,
    therapeuticClass: values.therapeuticClass || undefined,
    dosageForm: values.dosageForm || undefined,
    strength: values.strength || undefined,
    generalUse: values.generalUse || '',
    adultDosage: values.adultDosage || '',
    pediatricDosage: values.pediatricDosage || '',
    isPrescriptionRequired: values.isPrescriptionRequired ?? false,
    isControlledSubstance: values.isControlledSubstance ?? false,
  };
}

export const genericDrugsConfig: ModelConfig = {
  id: 'generic-drugs',
  title: 'Generic Drugs',
  description: 'Manage generic drug reference records.',
  endpoint: '/generic-products',
  columns,
  createFields,
  buildCreatePayload,
  canDelete: true,
};
