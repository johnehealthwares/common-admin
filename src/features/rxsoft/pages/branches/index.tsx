import { DataPageShell } from "../../../components/data-page-shell";

export function RxBranchesPage() {
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
      createFields={[
        { name: 'code', label: 'Code', required: true, placeholder: 'MAIN' },
        { name: 'name', label: 'Name', required: true, placeholder: 'Main Branch' },
        { name: 'address', label: 'Address' },
      ]}
      sortOptions={[
        { value: 'createdAt', label: 'Created' },
        { value: 'updatedAt', label: 'Updated' },
        { value: 'name', label: 'Name' },
        { value: 'code', label: 'Code' },
      ]}
      buildCreatePayload={(values) => ({
        code: values.code,
        name: values.name,
        address: values.address || undefined,
      })}
    />
  )
}