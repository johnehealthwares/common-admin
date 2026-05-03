import { DataPageShell } from "../../../components/data-page-shell";

export function RxOrganizationsPage() {
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
      sortOptions={[
        { value: 'name', label: 'Name' },
        { value: 'code', label: 'Code' },
        { value: 'updatedAt', label: 'Updated' },
      ]}
      canDelete
    />
  )
}