import { useState } from "react";
import { DataPageShell } from "../../../components/page/data-page-shell";

export function RxDrugComponentsPage() {
  const [formState, setFormState] = useState<Record<string, unknown>>({});
    const updateField = (name: string, value: unknown) => {
      setFormState((current: any) => ({
        ...current,
        [name]: value,
      }))
      console.log({ formState })
    }
    
  return (
    <DataPageShell
      title='Drug Components'
      description='Manage active ingredients and component lookup values.'
      endpoint='/drug-components'
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'updatedAt', label: 'Updated' },
      ]}
      createFields={[{ name: 'name', label: 'Name', required: true }]}
      formState={formState}
      setFormState={setFormState}
      updateField={updateField}
      buildCreatePayload={(values) => ({
        name: values.name,
      })}
      canExport
      csvEndpoint='/drug-components/export'
    />
  )
}