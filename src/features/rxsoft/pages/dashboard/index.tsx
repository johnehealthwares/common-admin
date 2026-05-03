import { useQuery } from '@tanstack/react-query'
import {
  Card,
  Text,
  Stack,
  Grid,
  Loader,
  Center,
  SimpleGrid,
} from '@mantine/core'

import { rxsoftApi } from '@/lib/rxsoft-api'
import { RxPage } from '../../../components/rx-page'
import type {
  DailySale,
  InventoryValuation,
  TopProduct,
} from '../../types'
import { ReportsTable } from '../reports/components/table'

export function RxDashboardPage() {
  const reportsQuery = useQuery({
    queryKey: ['rxsoft-dashboard-reports'],
    queryFn: async () => {
      const [dailySales, inventory, topProducts] = await Promise.all([
        rxsoftApi.get<DailySale[]>('/reports/daily-sales'),
        rxsoftApi.get<InventoryValuation>('/reports/inventory-valuation'),
        rxsoftApi.get<TopProduct[]>('/reports/top-selling-products'),
      ])

      return {
        dailySales: dailySales.data,
        inventory: inventory.data,
        topProducts: topProducts.data,
      }
    },
  })

  const data = reportsQuery.data

  return (
    <RxPage
      title="Dashboard"
      description="Operational KPIs from RxSoft reporting endpoints."
    >
      {/* LOADING */}
      {reportsQuery.isLoading && (
        <Center py="xl">
          <Loader />
        </Center>
      )}

      {/* ERROR */}
      {reportsQuery.isError && (
        <Text c="red" size="sm">
          Failed to load dashboard reports.
        </Text>
      )}

      {/* CONTENT */}
      {data && (
        <Stack gap="xl">
          {/* KPI GRID */}
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
            <Card withBorder p="md">
              <Text size="sm" c="dimmed">
                Inventory Items
              </Text>
              <Text fw={700} size="xl">
                {data.inventory.itemsCount}
              </Text>
            </Card>

            <Card withBorder p="md">
              <Text size="sm" c="dimmed">
                Total Quantity
              </Text>
              <Text fw={700} size="xl">
                {data.inventory.totalQuantity}
              </Text>
            </Card>

            <Card withBorder p="md">
              <Text size="sm" c="dimmed">
                Sales Days
              </Text>
              <Text fw={700} size="xl">
                {data.dailySales.length}
              </Text>
            </Card>

            <Card withBorder p="md">
              <Text size="sm" c="dimmed">
                Top Products
              </Text>
              <Text fw={700} size="xl">
                {data.topProducts.length}
              </Text>
            </Card>
          </SimpleGrid>

          {/* TABLES */}
          <Grid>
            <Grid.Col span={{ base: 12, xl: 6 }}>
              <ReportsTable
                title="Recent Daily Sales"
                description="Sales count and value by day"
                columns={['Day', 'Sales Count', 'Total Amount']}
                rows={data.dailySales.map((item) => (
                  <tr key={item.day}>
                    <td>{item.day}</td>
                    <td>{item.salesCount}</td>
                    <td>{item.totalAmount}</td>
                  </tr>
                ))}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, xl: 6 }}>
              <ReportsTable
                title="Top Selling Products"
                description="Highest performers by sold quantity"
                columns={['Product', 'Qty Sold', 'Revenue']}
                rows={data.topProducts.map((item) => (
                  <tr key={item.productCode}>
                    <td>{item.productCode}</td>
                    <td>{item.quantitySold}</td>
                    <td>{item.revenue}</td>
                  </tr>
                ))}
              />
            </Grid.Col>
          </Grid>
        </Stack>
      )}
    </RxPage>
  )
}