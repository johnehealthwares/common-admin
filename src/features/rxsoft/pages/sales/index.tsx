import { useState } from "react";
import { DataPageShell } from "../../../components/page/data-page-shell";

export function RxSalesPage() {
    const [formState, setFormState] = useState<Record<string, unknown>>({});
  
    const updateField = (name: string, value: unknown) => {
      setFormState((current) => ({
        ...current,
        [name]: value,
      }))
      console.log({ formState })
    }
  return (
    <DataPageShell
      title='Sales'
      description='Review sales, refunds, payment filters and operational drill-down.'
      endpoint='/sales'
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'saleNumber', label: 'Sale #' },
        { key: 'saleChannel', label: 'Channel' },
        { key: 'storeId', label: 'Store' },
        { key: 'totalAmount', label: 'Total' },
        { key: 'status', label: 'Status' },
        { key: 'saleDate', label: 'Date' },
      ]}
      createFields={[
        { name: 'saleNumber', label: 'Sale Number', required: true },
        {
          name: 'saleChannel',
          label: 'Sale Channel',
          required: true,
          placeholder: 'pos',
        },
        { name: 'storeId', label: 'Store ID', required: true },
        { name: 'customerId', label: 'Customer ID' },
        {
          name: 'linesJson',
          label: 'Lines JSON',
          required: true,
          placeholder:
            '[{"productId":"...","uomId":"...","quantity":1,"unitPrice":10}]',
        },
        {
          name: 'paymentsJson',
          label: 'Payments JSON',
          required: true,
          placeholder: '[{"paymentMethodId":"...","amount":10}]',
        },
      ]}
      buildCreatePayload={(values) => ({
        saleNumber: values.saleNumber,
        saleChannel: values.saleChannel,
        storeId: values.storeId,
        customerId: values.customerId || undefined,
        lines: JSON.parse(String(values.linesJson ?? '[]')),
        payments: JSON.parse(String(values.paymentsJson ?? '[]')),
      })}
      canDelete
      formState={formState}
      setFormState={setFormState}
      updateField={updateField}
    />
  )
}