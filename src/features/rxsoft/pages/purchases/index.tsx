import { DataPageShell } from "../../../components/data-page-shell";

export function RxPurchasesPage() {
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
      sortOptions={[
        { value: 'createdAt', label: 'Created' },
        { value: 'updatedAt', label: 'Updated' },
        { value: 'status', label: 'Status' },
        { value: 'totalCost', label: 'Total Cost' },
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
    />
  )
}