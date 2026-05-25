import { useState } from "react";
import { DataPageShell } from "../../../components/page/data-page-shell";

export function RxOrganizationsPage() {
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
      title='Organizations'
      description='Tenant-level organization records and activation status.'
      endpoint='/organizations'
      columns={[
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Name' },
        { key: 'isActive', label: 'Active' },
        { key: 'updatedAt', label: 'Updated' },
      ]}
      createFields={[
        { name: 'code', label: 'Code', required: true },
        { name: 'name', label: 'Name', required: true },
        { name: 'isActive', label: 'Active', type: 'switch', defaultValue: true },
      ]}
      canDelete
      formState={formState}
      setFormState={setFormState}
      updateField={updateField}
    />
  )
}