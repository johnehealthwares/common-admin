import { Field } from '@/features/rxsoft/types';
import {
  AE_STATUS_OPTIONS,
  PROTOCOL_TYPE_OPTIONS,
  TLS_VERSION_OPTIONS,
} from '../../types/constants';

export const generalFieldGroups: {
  title?: string;
  fields: Field[];
}[] = [
  {
    fields: [
      {
        name: 'name',
        label: 'AE Name',
        required: true,
        placeholder: 'e.g., Hospital XYZ EMR',
        col: 12,
      },
      {
        name: 'description',
        label: 'Description',
        placeholder: 'Electroninc medical record app used for sending orders',
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
];

export const inboundFieldGroups: {
  title?: string;
  fields: Field[];
}[] = [
  {
    title: 'Inbound Protocol Configuration',
    fields: [
      {
        name: 'inboundConfig',
        label: 'Inbound Protocol Configurations',
        type: 'json',
        col: 12,
      },
    ],
  },
];

export const outboundFieldGroups: {
  title?: string;
  fields: Field[];
}[] = [
  {
    title: 'Outbound Protocol Configuration',
    fields: [
      {
        name: 'outboundConfig',
        label: 'Outbound Protocol Configurations',
        type: 'json',
        col: 12,
      },
    ],
  },
];

export const securityFieldGroups: {
  title?: string;
  fields: Field[];
}[] = [
  {
    fields: [
      {
        name: 'securitySettings.tlsEnabled',
        label: 'Enable TLS',
        type: 'switch',
        col: 12,
      },
    ],
  },
  {
    fields: [
      {
        name: 'securitySettings.tlsVersion',
        label: 'TLS Version',
        type: 'select',
        options: TLS_VERSION_OPTIONS,
        col: 6,
      },
      {
        name: 'securitySettings.acceptSelfSigned',
        label: 'Accept Self-Signed Certificates',
        type: 'switch',
        col: 6,
      },
    ],
  },
  {
    fields: [
      {
        name: 'securitySettings.certificatePath',
        label: 'Certificate Path',
        col: 6,
      },
      {
        name: 'securitySettings.privateKeyPath',
        label: 'Private Key Path',
        col: 6,
      },
    ],
  },
  {
    fields: [
      {
        name: 'securitySettings.caPath',
        label: 'CA Path',
        col: 12,
      },
    ],
  },
];

export const attributesFieldGroups: {
  title?: string;
  fields: Field[];
}[] = [
  {
    fields: [
      {
        name: 'attributes',
        label: 'Custom Attributes',
        type: 'json',
        col: 12,
      },
    ],
  },
];
