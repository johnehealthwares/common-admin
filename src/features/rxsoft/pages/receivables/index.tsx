import { DataPageShell } from "../../../components/data-page-shell";

export function RxReceivablesPage() {
  return (
    <DataPageShell
      title='Receivables'
      description='Track outstanding receivables.'
      endpoint='/receivables'
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'customerId', label: 'Customer' },
        { key: 'status', label: 'Status' },
        { key: 'originalAmount', label: 'Original Amount' },
        { key: 'outstandingAmount', label: 'Outstanding Amount' },
      ]}
    />
  )
}