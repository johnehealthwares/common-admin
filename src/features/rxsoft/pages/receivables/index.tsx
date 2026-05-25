import { useState } from "react";
import { DataPageShell } from "../../../components/page/data-page-shell";

export function RxReceivablesPage() {
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
      title='Receivables'
      description='Track outstanding receivables.'
      endpoint='/receivables'
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'customerId', label: 'Customer' },
        { key: 'status', label: 'Status' },
        { key: 'originalAmount', label: 'Original Amount' },
        { key: 'outstandingAmount', label: 'Outstanding Amount' },
      ]}
      formState={formState}
      setFormState={setFormState}
      updateField={updateField}
    />
  )
}