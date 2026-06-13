import { Card, Text, Stack, Grid, Button, TextInput, Group } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { rxsoftApi } from '@/lib/rxsoft-api';
import { DataPageShell } from '../../../components/page/data-page-shell';
import { RxPage } from '../../../components/page/rx-page';
import { stockBalancesConfig, stockMovementsConfig } from './schema';

export function RxInventoryPage() {
  const [stockBalanceId, setStockBalanceId] = useState('');
  const [deltaQuantity, setDeltaQuantity] = useState('');
  const [reason, setReason] = useState('');

  const adjustmentMutation = useMutation({
    mutationFn: async () => {
      await rxsoftApi.post('/inventory/adjustments', {
        stockBalanceId,
        deltaQuantity: Number(deltaQuantity),
        reason,
      });
    },
    onSuccess: () => {
      notifications.show({
        message: 'Adjustment posted successfully.',
        color: 'green',
      });

      setStockBalanceId('');
      setDeltaQuantity('');
      setReason('');
    },
    onError: () => {
      notifications.show({
        message: 'Failed to post adjustment.',
        color: 'red',
      });
    },
  });

  return (
    <RxPage
      title="Inventory"
      description="Stock balances, movement history, and manual adjustments."
    >
      <Stack gap="xl">
        {/* STOCK BALANCES */}
        <DataPageShell config={stockBalancesConfig} />

        {/* STOCK MOVEMENTS */}
        <DataPageShell config={stockMovementsConfig} />

        {/* ADJUSTMENT FORM */}
        <Card withBorder p="md">
          <Stack gap="sm">
            <Text fw={600}>New Stock Adjustment</Text>
            <Text size="sm" c="dimmed">
              POST /inventory/adjustments
            </Text>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                adjustmentMutation.mutate();
              }}
            >
              <Grid>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <TextInput
                    label="Stock Balance ID"
                    value={stockBalanceId}
                    onChange={(e) => setStockBalanceId(e.currentTarget.value)}
                    required
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 4 }}>
                  <TextInput
                    label="Delta Quantity"
                    type="number"
                    value={deltaQuantity}
                    onChange={(e) => setDeltaQuantity(e.currentTarget.value)}
                    required
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 4 }}>
                  <TextInput
                    label="Reason"
                    value={reason}
                    onChange={(e) => setReason(e.currentTarget.value)}
                    required
                  />
                </Grid.Col>

                <Grid.Col span={12}>
                  <Group justify="flex-end">
                    <Button type="submit" loading={adjustmentMutation.isPending}>
                      Post Adjustment
                    </Button>
                  </Group>
                </Grid.Col>
              </Grid>
            </form>
          </Stack>
        </Card>
      </Stack>
    </RxPage>
  );
}
