import { DataPageShell } from "../../../components/data-page-shell";

export function RxSettingsPage() {
  return (
    <DataPageShell
      title='Settings'
      description='Store, tax, currency, payment and platform configuration.'
      endpoint='/settings'
      columns={[
        { key: 'key', label: 'Key' },
        { key: 'value', label: 'Value' },
        { key: 'description', label: 'Description' },
        { key: 'updatedAt', label: 'Updated' },
      ]}
      createFields={[
        { name: 'key', label: 'Key', required: true, placeholder: 'store.name' },
        { name: 'value', label: 'Value', required: true },
        { name: 'description', label: 'Description' },
      ]}
      sortOptions={[
        { value: 'updatedAt', label: 'Updated' },
        { value: 'key', label: 'Key' },
      ]}
      buildCreatePayload={(values) => ({
        key: values.key,
        value: values.value,
        description: values.description || undefined,
      })}
    />
  )
}