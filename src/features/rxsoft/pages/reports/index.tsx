import { Card, Text, Stack, Grid, Button, Loader, Center } from '@mantine/core';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { downloadBlob, rxsoftApi } from '@/lib/rxsoft-api';
import { RxPage } from '../../../components/page/rx-page';
import type { DailySale, InventoryValuation, TopProduct } from '../../types';
import { ReportsTable } from './components/table';

export function RxReportsPage() {
  const [error, setError] = useState<string | null>(null);
  const [formState, setFormState] = useState<Record<string, unknown>>({});

  const updateField = (name: string, value: unknown) => {
    setFormState((current) => ({
      ...current,
      [name]: value,
    }));
    console.log({ formState });
  };

  const reportsQuery = useQuery({
    queryKey: ['rxsoft-reports'],
    queryFn: async () => {
      const [dailySales, inventory, topProducts] = await Promise.all([
        rxsoftApi.get<DailySale[]>('/reports/daily-sales'),
        rxsoftApi.get<InventoryValuation>('/reports/inventory-valuation'),
        rxsoftApi.get<TopProduct[]>('/reports/top-selling-products'),
      ]);

      return {
        dailySales: dailySales.data,
        inventory: inventory.data,
        topProducts: topProducts.data,
      };
    },
  });

  const exportMutation = useMutation({
    mutationFn: async () => {
      await downloadBlob({ method: 'GET', url: '/reports/export' }, 'reports_summary.csv');
    },
    onError: () => setError('Failed to export report summary.'),
  });

  const data = reportsQuery.data;

  return (
    <RxPage
      title="Reports"
      description="Daily/monthly analytics and export-ready operational reports."
      actions={
        <Button onClick={() => exportMutation.mutate()} loading={exportMutation.isPending}>
          Export Summary
        </Button>
      }
    >
      {/* LOADING */}
      {reportsQuery.isLoading && (
        <Center py="xl">
          <Loader />
        </Center>
      )}

      {/* ERROR */}
      {(reportsQuery.isError || error) && (
        <Text c="red" size="sm">
          {error ?? 'Failed to load reports.'}
        </Text>
      )}

      {/* CONTENT */}
      {data && (
        <Stack gap="lg">
          {/* KPI CARDS */}
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card withBorder p="md">
                <Text size="sm" c="dimmed">
                  Inventory Items
                </Text>
                <Text size="xl" fw={700}>
                  {data.inventory.itemsCount}
                </Text>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card withBorder p="md">
                <Text size="sm" c="dimmed">
                  Total Quantity
                </Text>
                <Text size="xl" fw={700}>
                  {data.inventory.totalQuantity}
                </Text>
              </Card>
            </Grid.Col>
          </Grid>

          {/* TABLES */}
          <Grid>
            <Grid.Col span={{ base: 12, xl: 6 }}>
              <ReportsTable
                title="Daily Sales"
                description="Operational totals by day"
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
                title="Top Products"
                description="Best-performing products"
                columns={['Product', 'Quantity Sold', 'Revenue']}
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
  );
}
