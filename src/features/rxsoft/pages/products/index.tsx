import {
  ProductPriceListSetup,
  ProductStockQuantitySetup,
  type PendingPriceListEntry,
  type PendingStockEntry,
} from './components/product-setup-components'
import {
  buildProductCreatePayload,
  productCreateFieldGroups,
  productSearchConfig,
} from './types/products.schema'
import { DataPageShell } from '../../../components/data-page-shell';

export function RxProductsPage() {
  return (
    <DataPageShell
      title='Products'
      description='Manage product catalog records.'
      endpoint='/products'
      columns={[
        {
          key: 'category',
          label: 'Category',
          render: (row) => String((row.category as { name?: string } | null)?.name ?? ''),
        },
        { key: 'name', label: 'Product Name' },
        { key: 'code', label: 'Code' },
        { key: 'barcode', label: 'Barcode' },
      ]}
      modalTitle='Add Product'
      createFieldGroups={productCreateFieldGroups}
      sortOptions={[
        { value: 'name', label: 'Name' },
        { value: 'code', label: 'Code' },
        { value: 'createdAt', label: 'Created Date' },
      ]}
      searchConfig={productSearchConfig}
      buildCreatePayload={buildProductCreatePayload}
      buildUpdatePayload={buildProductCreatePayload}
      renderCreateExtras={({ formValues, updateField }) => (
        <div className='space-y-6'>
          <ProductPriceListSetup
            existigPriceLists={(formValues.priceListEntries as PendingPriceListEntry[] | undefined) ?? []}
            onChange={(next) => updateField('priceListEntries', next)}
            mode='create'
          />
          <ProductStockQuantitySetup
            value={(formValues.stockEntries as PendingStockEntry[] | undefined) ?? []}
            onChange={(next) => updateField('stockEntries', next)}
          />
        </div>
      )}
      detailPathBuilder={(row) => `/products/${String(row.id)}`}
    />
  )
}

export * from './components/detail';