import { DataPageShell } from "../../../components/data-page-shell";

export function RxDrugComponentsPage() {
  return (
    <DataPageShell
      title='Drug Components'
      description='Manage active ingredients and component lookup values.'
      endpoint='/drug-components'
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'updatedAt', label: 'Updated' },
      ]}
      createFields={[{ name: 'name', label: 'Name', required: true }]}
      sortOptions={[
        { value: 'name', label: 'Name' },
        { value: 'updatedAt', label: 'Updated' },
      ]}
      canDelete
    />
  )
}