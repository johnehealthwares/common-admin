import { useState } from "react";
import { DataPageShell } from "../../../components/page/data-page-shell";

export function RxPriceListsPage() {
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
      title='Price Lists'
      description='Create and maintain named pricing policies.'
      endpoint='/price-lists'
      columns={[
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Name' },
        { key: 'isDefault', label: 'Default' },
        { key: 'isActive', label: 'Active' },
      ]}
      createFields={[
        { name: 'code', label: 'Code', required: true },
        { name: 'name', label: 'Name', required: true },
        { name: 'isDefault', label: 'Default', type: 'switch', defaultValue: false },
        { name: 'isActive', label: 'Active', type: 'switch', defaultValue: true },
      ]}
      canDelete
      formState={formState}
      setFormState={setFormState}
      updateField={updateField}
      buildUpdatePayload={({id, createdAt, updatedAt, organizationId, ...rest}) => ({...rest})}
    />
  )
}