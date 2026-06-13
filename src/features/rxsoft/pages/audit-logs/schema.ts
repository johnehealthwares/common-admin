import type { ModelConfig } from '../../../shared/model-schema';
import type { Column } from '../../types';

const columns: Column[] = [
  { key: 'id', label: 'ID' },
  { key: 'actorId', label: 'Actor' },
  { key: 'entityName', label: 'Entity' },
  { key: 'entityId', label: 'Entity ID' },
  { key: 'action', label: 'Action' },
  { key: 'createdAt', label: 'Created' },
];

export const auditLogsConfig: ModelConfig = {
  id: 'audit-logs',
  title: 'Audit Logs',
  description: 'Read-only system audit trail.',
  endpoint: '/audit-logs',
  columns,
};
