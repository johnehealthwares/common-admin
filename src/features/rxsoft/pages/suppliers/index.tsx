import { useState } from "react";
import { DataPageShell } from "../../../components/page/data-page-shell";

export function RxSuppliersPage() {
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
      title='Suppliers'
      description='Supplier management, purchase partner details and status tracking.'
      endpoint='/suppliers'
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'phone', label: 'Phone' },
        { key: 'email', label: 'Email' },
        { key: 'addressLine1', label: 'Address' },
        { key: 'updatedAt', label: 'Updated' },
      ]}
      createFields={[
        { name: 'name', label: 'Name', required: true },
        { name: 'phone', label: 'Phone' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'address', label: 'Address' },
      ]}
      buildCreatePayload={(values) => ({
        name: values.name,
        phone: values.phone || undefined,
        email: values.email || undefined,
        address: values.address || undefined,
      })}
      formState={formState}
      setFormState={setFormState}
      updateField={updateField}
    />
  )
}