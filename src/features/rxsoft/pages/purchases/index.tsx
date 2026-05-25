import { useState } from "react";
import { DataPageShell } from "../../../components/page/data-page-shell";

export function RxPurchasesPage() {
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
      title='Purchases'
      description='Record and review purchase orders and goods intake.'
      endpoint='/purchases'
      columns={[
        { key: 'invoiceNumber', label: 'PO/Invoice' },
        { key: 'supplierId', label: 'Supplier' },
        { key: 'warehouseId', label: 'Warehouse' },
        { key: 'currencyCode', label: 'Currency' },
        { key: 'totalCost', label: 'Total Cost' },
        { key: 'status', label: 'Status' },
        {
          key: 'lines',
          label: 'Lines',
          render: (row) => String(((row.lines as unknown[]) ?? []).length),
        },
      ]}
      createFields={[
        { name: 'supplierId', label: 'Supplier ID', required: true },
        { name: 'warehouseId', label: 'Warehouse ID/Code', required: true },
        { name: 'productId', label: 'Product ID', required: true },
        { name: 'quantity', label: 'Quantity', type: 'number', required: true },
        { name: 'unitCost', label: 'Unit Cost', type: 'number', required: true },
        { name: 'invoiceNumber', label: 'Invoice/PO Number' },
        { name: 'currencyCode', label: 'Currency Code', placeholder: 'USD' },
        { name: 'status', label: 'Status', placeholder: 'draft' },
        { name: 'note', label: 'Note' },
      ]}
      buildCreatePayload={(values) => ({
        supplierId: values.supplierId,
        warehouseId: values.warehouseId,
        productId: values.productId,
        quantity: Number(values.quantity || 0),
        unitCost: Number(values.unitCost || 0),
        invoiceNumber: values.invoiceNumber || undefined,
        currencyCode: values.currencyCode || undefined,
        status: values.status || undefined,
        note: values.note || undefined,
      })}
      canDelete
      formState={formState}
      setFormState={setFormState}
      updateField={updateField}
    />
  )
}