import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Card,
  Text,
  Stack,
  Select,
  Loader,
  Center,
  Table,
} from '@mantine/core'

import { rxsoftApi } from '@/lib/rxsoft-api'
import { RxPage } from '../../../components/rx-page'
import { getArrayPayload } from '../../../components/utils'

function getRowsFromPayload(payload: unknown): Record<string, unknown>[] {
  return getArrayPayload(payload)
}

export function RxPriceListItemsPage() {
  const [priceListId, setPriceListId] = useState<string>('')

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

  const endpoint = priceListId
    ? `/price-lists/${priceListId}/items`
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

  return (
    <RxPage
      title="Price List Items"
      description="Manage product prices inside a selected price list, including location-specific pricing."
    >
      <Stack gap="lg">
        {/* SELECT CARD */}
        <Card withBorder p="md">
          <Stack gap="xs">
            <Text fw={600}>Select Price List</Text>
            <Text size="sm" c="dimmed">
              Choose the parent price list before managing items.
            </Text>

            <Select
              placeholder="Select a price list"
              value={priceListId}
              onChange={(value) => setPriceListId(value ?? '')}
              data={priceListOptions}
            />
          </Stack>
        </Card>

        {/* LOADING STATE */}
        {query.isLoading && priceListId && (
          <Center py="lg">
            <Loader />
          </Center>
        )}

        {/* TABLE */}
        {priceListId && query.data && (
          <Card withBorder p="md">
            <Table
              striped
              highlightOnHover
              withTableBorder
              withColumnBorders
            >
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Product</Table.Th>
                  <Table.Th>Location</Table.Th>
                  <Table.Th>Currency</Table.Th>
                  <Table.Th>Unit Price</Table.Th>
                  <Table.Th>Starts</Table.Th>
                  <Table.Th>Ends</Table.Th>
                </Table.Tr>
              </Table.Thead>

              <Table.Tbody>
                {rows.map((row: any, index) => (
                  <Table.Tr key={index}>
                    <Table.Td>
                      {row.product?.name ?? ''}
                    </Table.Td>
                    <Table.Td>
                      {row.location?.name ?? ''}
                    </Table.Td>
                    <Table.Td>{row.currencyCode}</Table.Td>
                    <Table.Td>{row.unitPrice}</Table.Td>
                    <Table.Td>{row.startsAt}</Table.Td>
                    <Table.Td>{row.endsAt}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card>
        )}
      </Stack>
    </RxPage>
  )
}