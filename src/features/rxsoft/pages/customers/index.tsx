import { DataPageShell } from "../../../components/data-page-shell";

export function RxCustomersPage() {
  return (
    <DataPageShell
      title='Customers'
      description='Maintain customer records and account-level visibility.'
      endpoint='/customers'
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
        { value: 'name', label: 'Name' },
        { value: 'createdAt', label: 'Created' },
      ]}
      buildCreatePayload={(values) => ({
        name: values.name,
        phone: values.phone || undefined,
        email: values.email || undefined,
        address: values.address || undefined,
      })}
      canExport
      csvEndpoint='/customers/export'
    />
  )
}
