import { Badge, Group, Text } from '@mantine/core';
import { AlertCircle, CheckCircle, Server } from 'lucide-react';
import { Column, ColumnTypeFilters } from '@/features/rxsoft/types';

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return <CheckCircle size={14} />;
    case 'ERROR':
      return <AlertCircle size={14} />;
    default:
      return <Server size={14} />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'green';
    case 'INACTIVE':
      return 'gray';
    case 'MAINTENANCE':
      return 'yellow';
    case 'ERROR':
      return 'red';
    default:
      return 'blue';
  }
};

export const columns: Column[] = [
  {
    key: 'id',
    label: 'ID',
    render: (row) => (
      <Text size="sm" truncate>
        {String(row.id).substring(0, 8)}
      </Text>
    ),
  },
  {
    key: 'name',
    label: 'Name',
    render: (row: any) => (
      <Text size="sm" fw={500}>
        {row.name}
      </Text>
    ),
    filters: ColumnTypeFilters.STRING,
  },
  {
    key: 'facilityCode',
    label: 'Facility Code',
    render: (row: any) => <Text size="sm">{row.facilityCode || '-'}</Text>,
  },
  {
    key: 'status',
    label: 'Status',
    render: (row) => {
      const status = String(row.status);
      return (
        <Badge color={getStatusColor(status)}>
          {getStatusIcon(status)}
          {status}
        </Badge>
      );
    },
  },
  {
    key: 'inboundCapabilities',
    label: 'Inbound',
    render: (row) => {
      const caps = Array.isArray(row.inboundCapabilities)
        ? row.inboundCapabilities.slice(0, 2)
        : [];
      return (
        <Group gap="xs">
          {caps.map((cap) => (
            <Badge size="sm" variant="light" key={cap}>
              {cap}
            </Badge>
          ))}
        </Group>
      );
    },
  },
  {
    key: 'outboundCapabilities',
    label: 'Outbound',
    render: (row) => {
      const caps = Array.isArray(row.outboundCapabilities)
        ? row.outboundCapabilities.slice(0, 2)
        : [];
      return (
        <Group gap="xs">
          {caps.map((cap) => (
            <Badge size="sm" variant="light" key={cap}>
              {cap}
            </Badge>
          ))}
        </Group>
      );
    },
  },
  {
    key: 'createdAt',
    label: 'Created',
    render: (row) => (
      <Text size="sm">
        {row.createdAt ? new Date(String(row.createdAt)).toLocaleDateString() : '-'}
      </Text>
    ),
  },
];
