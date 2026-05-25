import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'


import { rxsoftApi } from '@/lib/rxsoft-api'
import { getArrayPayload } from '../../../components/utils'
import { DataPageShell } from '@/features/components/page/data-page-shell'
import { ColumnTypeFilters, Option } from '../../types'
import { buildFormState, buildPayload, columns, fieldGroups } from './schema'

function getRowsFromPayload(payload: unknown): Record<string, unknown>[] {
  return getArrayPayload(payload)
}

export function RxPriceListItemsPage() {
  const [priceList, setPriceList] = useState<Option | null>()
  const [formState, setFormState] = useState<Record<string, unknown>>({})


 
  const priceListsQuery = useQuery({
    queryKey: ['rxsoft-price-lists-select'],
    queryFn: async () => {
      const res = await rxsoftApi.get('/price-lists')
      return (res.data.data ?? []) as Array<{
        id: string
        name: string
        code: string
      }>
    },
  })

  const endpoint = priceList
    ? `/price-lists/${priceList?.value}/items`
    : null

  const queryParams = useMemo(() => ({}), [])

  const query = useQuery({
    queryKey: ['rxsoft-price-list-items', endpoint, queryParams],
    queryFn: async () => {
      if (!endpoint) return null
      const res = await rxsoftApi.get(endpoint, { params: queryParams })
      return res.data
    },
    enabled: !!endpoint,
  })

  const rows = getRowsFromPayload(query.data)

  const priceListOptions =
    priceListsQuery.data?.map((pl) => ({
      value: pl.id,
      label: pl.name,
    })) ?? []


  const updateField = (name: string, value: unknown) => {
    setFormState((current) => ({
      ...current,
      [name]: value,
    }))
  }

  return (
           <DataPageShell
                title='Products Prices'
                description='Manage product price list prices.'
                endpoint={`/price-lists/items`}
                columns={columns}
                modalTitle='Product Price'
                formState={formState}
                createFieldGroups={fieldGroups}
                setFormState={setFormState}
                updateField={updateField}
                buildCreatePayload={buildPayload}
                buildFormState={buildFormState}
              />
      
  )
}