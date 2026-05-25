import { useState } from "react";
import { DataPageShell } from "../../../components/page/data-page-shell";

export function RxAuditLogsPage() {
  const [formState, setFormState] = useState<Record<string, unknown>>({});

  const updateField = (name: string, value: unknown) => {
    setFormState((current) => ({
      ...current,
      [name]: value,
    }))
    console.log({ formState })
  }

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
      formState={formState}
      setFormState={setFormState}
      updateField={updateField}
      tabGroups={[]}
      buildCreatePayload={(data) => data}
      buildUpdatePayload={(data) => data}
    />
  )
}