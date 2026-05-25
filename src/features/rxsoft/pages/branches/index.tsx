import { useState } from "react";
import { DataPageShell } from "../../../components/page/data-page-shell";

export function RxBranchesPage() {
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
      title='Branches'
      description='Branch/store setup and activation controls for multi-location operations.'
      endpoint='/branches'
      columns={[
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Name' },
        { key: 'address', label: 'Address' },
        { key: 'updatedAt', label: 'Updated' },
      ]}
      formState={formState}
      setFormState={setFormState}
      updateField={updateField}
      tabGroups={[
        {
          title: 'General Info',
          value: 'general',
          fieldGroups: [
            {
              fields: [
                { name: 'code', label: 'Code', required: true, placeholder: 'MAIN' },
                { name: 'name', label: 'Name', required: true, placeholder: 'Main Branch' },
                { name: 'address', label: 'Address' },
              ],
            },
          ],
        },
      ]}
      buildCreatePayload={(values) => ({
        code: values.code,
        name: values.name,
        address: values.address || undefined,
      })}
      buildUpdatePayload={(values) => ({
        code: values.code,
        name: values.name,
        address: values.address || undefined,
      })}
    />
  )
}