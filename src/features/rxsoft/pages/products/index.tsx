import {
  buildFormState,
  buildProductPayload,
  tabGroups,
} from './types/schema'
import { DataPageShell } from '../../../components/page/data-page-shell';
import { useState } from 'react';
import { ColumnTypeFilters } from '../../types';


export function RxProductsPage() {
  const [formState, setFormState] = useState<Record<string, unknown>>({});

  const updateField = (name: string, value: unknown, i?: number) => {
    setFormState((current) => ({
      ...current,
      [name]: value,
    }))
  }

  


  return (
    <DataPageShell
      title='Products'
      description='Manage product catalog records.'
      endpoint='/products'
      columns={[
        { key: 'category.name', label: 'Category' },
        { key: 'name', label: 'Product Name', filters: ColumnTypeFilters.STRING },
        { key: 'code', label: 'Code' },
        { key: 'barcode', label: 'Barcode'},
      ]}
      modalTitle='Add Product'
      tabGroups={tabGroups}
      formState={formState}
      setFormState={setFormState}
      updateField={updateField}
      buildCreatePayload={buildProductPayload}
      buildUpdatePayload={buildProductPayload}
      buildFormState={buildFormState}
      detailPathBuilder={(row) => `/products/${String(row.id)}`}
    />
  )
}

export * from './components/detail';