import { DataPageShell } from "../../../components/data-page-shell";

export function RxAuditLogsPage() {
  return (
    <DataPageShell
      title='Audit Logs'
      description='Read-only system audit trail.'
      endpoint='/audit-logs'
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'actorId', label: 'Actor' },
        { key: 'entityName', label: 'Entity' },
        { key: 'entityId', label: 'Entity ID' },
        { key: 'action', label: 'Action' },
        { key: 'createdAt', label: 'Created' },
      ]}
    />
  )
}