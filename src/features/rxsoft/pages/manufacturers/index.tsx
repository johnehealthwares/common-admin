import { DataPageShell } from "../../../components/data-page-shell";

export function RxManufacturersPage() {
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
      sortOptions={[
        { value: 'name', label: 'Name' },
        { value: 'updatedAt', label: 'Updated' },
      ]}
      canDelete
    />
  )
}