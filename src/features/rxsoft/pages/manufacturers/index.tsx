import { useState } from "react";
import { DataPageShell } from "../../../components/page/data-page-shell";

export function RxManufacturersPage() {
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
      title='Manufacturers'
      description='Manage medicine manufacturers and supplier production sources.'
      endpoint='/manufacturers'
      columns={[
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Name' },
        { key: 'updatedAt', label: 'Updated' },
      ]}
      createFields={[
        { name: 'code', label: 'Code' },
        { name: 'name', label: 'Name', required: true },
      ]}
      canDelete
      formState={formState}
      setFormState={setFormState}
      updateField={updateField}
      
    />
  )
}