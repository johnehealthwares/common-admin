import { Badge, Group, Text } from '@mantine/core';
import { AlertCircle, CheckCircle, Route } from 'lucide-react';
import { Column } from '@/features/rxsoft/types';
import { RouteStatus, MessageType } from '../../types/enums';

const getStatusIcon = (status: RouteStatus) => {
  switch (status) {
    case RouteStatus.ACTIVE:
      return <CheckCircle size={14} />;
    case RouteStatus.INACTIVE:
      return <AlertCircle size={14} />;
    default:
      return <Route size={14} />;
  }
};

const getStatusColor = (status: RouteStatus) => {
  switch (status) {
    case RouteStatus.ACTIVE:
      return 'green';
    case RouteStatus.INACTIVE:
      return 'gray';
    case RouteStatus.DELETED:
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
  },
  {
    key: 'sourceAE',
    label: 'Source AE',
    render: (row: any) => <Text size="sm">{row.sourceAE || '-'}</Text>,
  },
  {
    key: 'targetAE',
    label: 'Target AE',
    render: (row: any) => <Text size="sm">{row.targetAE || '-'}</Text>,
  },
  {
    key: 'messageType',
    label: 'Message Type',
    render: (row: any) => (
      <Badge size="sm" variant="light">
        {row.messageType}
      </Badge>
    ),
  },
  {
    key: 'priority',
    label: 'Priority',
    render: (row: any) => <Text size="sm">{row.priority}</Text>,
  },
  {
    key: 'status',
    label: 'Status',
    render: (row) => {
      const status = row.status as RouteStatus;
      return (
        <Badge color={getStatusColor(status)}>
          {getStatusIcon(status)}
          {status}
        </Badge>
      );
    },
  },
  {
    key: 'enabled',
    label: 'Enabled',
    render: (row: any) => (
      <Badge color={row.enabled ? 'green' : 'red'}>{row.enabled ? 'Yes' : 'No'}</Badge>
    ),
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
