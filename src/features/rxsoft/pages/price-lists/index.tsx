import { DataPageShell } from "../../../components/data-page-shell";

export function RxPriceListsPage() {
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
      sortOptions={[
        { value: 'updatedAt', label: 'Updated' },
        { value: 'createdAt', label: 'Created' },
        { value: 'code', label: 'Code' },
      ]}
      canDelete
    />
  )
}