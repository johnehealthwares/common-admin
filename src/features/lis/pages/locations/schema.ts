import type { Column, FieldGroup, TabGroup } from '@/features/rxsoft/types';
import type { ModelConfig } from '@/features/shared/model-schema';

const columns: Column[] = [
  { key: 'code', label: 'Code' },
  { key: 'name', label: 'Name' },
  { key: 'typeId', label: 'Type', render: (row: any) => row.type?.name ?? row.typeId },
  { key: 'active', label: 'Active' },
];

const tabGroups: TabGroup[] = [
  {
    title: 'Location',
    value: 'location',
    fieldGroups: [
      {
        title: 'Location Details',
        fields: [
          { name: 'code', label: 'Code', type: 'text', required: true, col: 4 },
          { name: 'name', label: 'Name', type: 'text', required: true, col: 8 },
          { name: 'typeId', label: 'Location Type', type: 'async-select', searchParam: { endpoint: '/lis/location-types', valueKey: 'id', labelKey: 'name' }, col: 4 },
          { name: 'parentId', label: 'Parent Location', type: 'async-select', searchParam: { endpoint: '/lis/locations', valueKey: 'id', labelKey: 'name' }, col: 4 },
          { name: 'description', label: 'Description', type: 'text', col: 12 },
          { name: 'active', label: 'Active', type: 'switch', col: 3 },
        ],
      },
    ],
  },
];

export const locationsConfig: ModelConfig = {
  id: 'locations',
  title: 'Locations',
  description: 'Physical locations and facility hierarchy.',
  endpoint: '/lis/locations',
  columns,
  tabGroups,
  buildCreatePayload: (v: any) => ({...v, typeId: v.typeId.value}),
  buildUpdatePayload: (v) => v,
  canDelete: true,
};
