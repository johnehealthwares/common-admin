import { Field } from '@/features/rxsoft/types'
import { AE_STATUS_OPTIONS } from '../../types/constants'

export const generalFieldGroups: {
  title?: string
  fields: Field[]
}[] = [
  {
    fields: [
      {
        name: 'name',
        label: 'AE Name',
        required: true,
        placeholder: 'e.g., Hospital XYZ',
        col: 12,
      },
      {
        name: 'description',
        label: 'Description',
        col: 12,
      },
    ],
  },
  {
    fields: [
      {
        name: 'facilityCode',
        label: 'Facility Code',
        placeholder: 'e.g., FAC001',
        col: 6,
      },
      {
        name: 'customId',
        label: 'Custom ID',
        placeholder: 'e.g., CUSTOM123',
        col: 6,
      },
    ],
  },
  {
    fields: [
      {
        name: 'facilityId',
        label: 'Facility ID',
        col: 6,
      },
      {
        name: 'facilityName',
        label: 'Facility Name',
        col: 6,
      },
    ],
  },
  {
    fields: [
      {
        name: 'organizationId',
        label: 'Organization ID',
        col: 6,
      },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        options: AE_STATUS_OPTIONS,
        col: 6,
      },
    ],
  },
]