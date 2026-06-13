import { Field } from '@/features/rxsoft/types';
import {
  ROUTING_MESSAGE_TYPE_OPTIONS,
  ROUTE_STATUS_OPTIONS,
  ROUTING_PROTOCOL_TYPE_OPTIONS,
} from '../../types/constants';

export const generalFieldGroups: {
  title?: string;
  fields: Field[];
}[] = [
  {
    fields: [
      {
        name: 'name',
        label: 'Rule Name',
        required: true,
        placeholder: 'e.g., Route Orders to Pharmacy',
        col: 12,
      },
      {
        name: 'description',
        label: 'Description',
        placeholder: 'Description of the routing rule',
        col: 12,
      },
    ],
  },
  {
    fields: [
      {
        name: 'priority',
        label: 'Priority',
        type: 'number',
        required: true,
        placeholder: '1',
        col: 6,
      },
      {
        name: 'messageType',
        label: 'Message Type',
        type: 'select',
        options: ROUTING_MESSAGE_TYPE_OPTIONS,
        required: true,
        col: 6,
      },
    ],
  },
  {
    fields: [
      {
        name: 'sourceAE',
        label: 'Source Application Entity',
        required: true,
        placeholder: 'e.g., EMR_APP',
        col: 6,
      },
      {
        name: 'targetAE',
        label: 'Target Application Entity',
        required: true,
        placeholder: 'e.g., PHARMACY_APP',
        col: 6,
      },
    ],
  },
  {
    fields: [
      {
        name: 'protocol',
        label: 'Protocol',
        type: 'select',
        options: ROUTING_PROTOCOL_TYPE_OPTIONS,
        col: 6,
      },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        options: ROUTE_STATUS_OPTIONS,
        required: true,
        col: 6,
      },
    ],
  },
  {
    fields: [
      {
        name: 'enabled',
        label: 'Enabled',
        type: 'checkbox',
        col: 6,
      },
    ],
  },
];
