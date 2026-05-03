import { DataPageShell } from "../../../components/data-page-shell";

export function RxSuppliersPage() {
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
      sortOptions={[
        { value: 'createdAt', label: 'Created' },
        { value: 'updatedAt', label: 'Updated' },
        { value: 'name', label: 'Name' },
      ]}
      buildCreatePayload={(values) => ({
        name: values.name,
        phone: values.phone || undefined,
        email: values.email || undefined,
        address: values.address || undefined,
      })}
    />
  )
}