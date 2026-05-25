import { useState } from "react";
import { DataPageShell } from "../../../components/page/data-page-shell";

export function RxPaymentMethodsPage() {
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
      title='Payment Methods'
      description='Accepted payment instruments and their active status.'
      endpoint='/payment-methods'
      columns={[
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Name' },
        { key: 'methodType', label: 'Type' },
        { key: 'isActive', label: 'Active' },
      ]}
      createFields={[
        { name: 'code', label: 'Code', required: true },
        { name: 'name', label: 'Name', required: true },
        { name: 'methodType', label: 'Method Type', required: true, placeholder: 'cash' },
        { name: 'isActive', label: 'Active', type: 'switch', defaultValue: true },
      ]}
      canDelete
      formState={formState}
      setFormState={setFormState}
      updateField={updateField}
    />
  )
}