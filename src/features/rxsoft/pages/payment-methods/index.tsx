import { DataPageShell } from "../../../components/data-page-shell";

export function RxPaymentMethodsPage() {
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
      sortOptions={[
        { value: 'updatedAt', label: 'Updated' },
        { value: 'code', label: 'Code' },
      ]}
      canDelete
    />
  )
}