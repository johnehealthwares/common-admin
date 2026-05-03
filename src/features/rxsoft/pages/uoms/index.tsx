import { DataPageShell } from "../../../components/data-page-shell";


export function RxUomsPage() {
  return (
    <DataPageShell
      title='UOMs'
      description='Manage units of measure.'
      endpoint='/uoms'
      columns={[
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Name' },
        { key: 'uomType', label: 'Type' },
        { key: 'factor', label: 'Factor' },
        { key: 'isActive', label: 'Active' },
      ]}
      createFields={[
        { name: 'code', label: 'Code' },
        { name: 'name', label: 'Name', required: true },
        { name: 'categoryId', 
          label: 'Category', 
          type: 'async-select',
          endpoint: '/uom-categories', 
          searchParam: 'search', 
          minChars: 2, 
          required: true 
        },
        { name: 'uomType', label: 'Type', placeholder: 'reference|bigger|smaller' },
        { name: 'factor', label: 'Factor', type: 'number' },
        { name: 'rounding', label: 'Rounding', type: 'number' },
      ]}
      sortOptions={[
        { value: 'name', label: 'Name' },
        { value: 'code', label: 'Code' },
      ]}
      buildCreatePayload={(values) => ({
        code: values.code || undefined,
        name: values.name,
        categoryId: values.categoryId || undefined,
        uomType: values.uomType || undefined,
        factor: values.factor ? Number(values.factor) : undefined,
        rounding: values.rounding ? Number(values.rounding) : undefined,
      })}
      canDelete
      detailPathBuilder={(row) => `/uoms/${String(row.id)}`}
    />
  )
}

export { RxUomEditPage } from './create'
export { RxUomDetailsPage } from './detail'
