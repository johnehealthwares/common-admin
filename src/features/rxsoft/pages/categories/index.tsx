import { DataPageShell } from "../../../components/data-page-shell";

export function RxCategoriesPage() {
  return (
    <DataPageShell
      title='Categories'
      description='Manage product categories with pagination, sorting, filtering and export.'
      endpoint='/categories'
      columns={[
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Name' },
        { key: 'parentId', label: 'Parent' },
      ]}
      createFields={[
        { name: 'code', label: 'Code', required: true, placeholder: 'ANALGESICS' },
        { name: 'name', label: 'Name', required: true, placeholder: 'Analgesics' },
        { name: 'parentId', label: 'Parent ID',
        type: 'async-select',
        endpoint: 'categories',
        searchParam: 'search',
        minChars: 2,
        required: true,
        col: 12, },
      ]}
      sortOptions={[
        { value: 'name', label: 'Name' },
        { value: 'code', label: 'Code' },
      ]}
      buildCreatePayload={(values) => ({
        code: values.code,
        name: values.name,
        parentId: values.parentId || undefined,
      })}
      canDelete
      canExport
      csvEndpoint='/categories/export'
    />
  )
}
