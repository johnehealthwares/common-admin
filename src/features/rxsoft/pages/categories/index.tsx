import { useState } from "react";
import { DataPageShell } from "../../../components/page/data-page-shell";

export function RxCategoriesPage() {
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
      title='Categories'
      description='Manage product categories with pagination, sorting, filtering and export.'
      endpoint='/categories'
      columns={[
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Name' },
        { key: 'parentId', label: 'Parent' },
      ]}
      createFields={[
        { name: 'code', label: 'Code', required: true, placeholder: 'ANALGESICS' },
        { name: 'name', label: 'Name', required: true, placeholder: 'Analgesics' },
        { name: 'parentId', label: 'Parent ID',
        type: 'async-select',
        searchParam: {
        endpoint: 'categories',
        minChars: 2,
        },
        required: true,
        col: 12, },
      ]}
      
      buildCreatePayload={(values) => ({
        code: values.code,
        name: values.name,
        parentId: values.parentId || undefined,
      })}
      canDelete
      canExport
      csvEndpoint='/categories/export'
      formState={formState}
      setFormState={setFormState}
      updateField={updateField}
    />
  )
}
