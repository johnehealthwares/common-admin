import { Card, Text, Stack, Grid, Button, TextInput, Group, Table, Modal, Select, NumberInput, Badge } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { ArrowRight, Rotate3D } from 'lucide-react';
import { rxsoftApi } from '@/lib/rxsoft-api';
import { DataPageShell } from '../../../components/page/data-page-shell';
import { RxPage } from '../../../components/page/rx-page';
import { stockBalancesConfig, stockMovementsConfig } from './schema';

function TransferModal({
  opened,
  onClose,
  balance,
}: {
  opened: boolean;
  onClose: () => void;
  balance: any | null;
}) {
  const qc = useQueryClient();
  const [toLocationId, setToLocationId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(0);

  const { data: locations = [] } = useQuery({
    queryKey: ['stock-locations', 'all'],
    queryFn: async () => {
      const { data } = await rxsoftApi.get('/stock-locations', { params: { limit: 200 } });
      return data?.data ?? data ?? [];
    },
  });

  const transferMutation = useMutation({
    mutationFn: async () => {
      await rxsoftApi.post('/inventory/transfers', {
        fromLocationId: balance?.locationId,
        toLocationId,
        itemId: balance?.itemId,
        quantity,
        reason: 'manual_transfer',
      });
    },
    onSuccess: () => {
      notifications.show({ message: 'Stock transferred successfully.', color: 'green' });
      qc.invalidateQueries({ queryKey: ['rxsoft-data-page'] });
      onClose();
    },
    onError: () => {
      notifications.show({ message: 'Transfer failed.', color: 'red' });
    },
  });

  return (
    <Modal opened={opened} onClose={onClose} title="Transfer Stock" centered>
      <Stack>
        <Text size="sm">
          From: <Badge>{balance?.location?.name as string ?? balance?.locationId as string}</Badge>
        </Text>
        <Text size="sm">
          Item: <Badge>{balance?.item?.name as string ?? balance?.itemId as string}</Badge>
        </Text>
        <Text size="sm">
          Available: <Badge color="blue">{Number(balance?.quantityOnHand ?? 0) - Number(balance?.quantityReserved ?? 0)}</Badge>
        </Text>

        <Select
          label="Destination Location"
          value={toLocationId}
          onChange={setToLocationId}
          data={(Array.isArray(locations) ? locations : [])
            .filter((l: any) => l.id !== balance?.locationId)
            .map((l: any) => ({ value: l.id, label: l.name }))}
          searchable
          required
        />

        <NumberInput
          label="Quantity"
          value={quantity}
          onChange={(v) => setQuantity(Number(v) || 0)}
          min={0.001}
          max={Number(balance?.quantityOnHand ?? 0)}
          required
        />

        <Group justify="flex-end">
          <Button variant="light" onClick={onClose}>Cancel</Button>
          <Button
            onClick={() => transferMutation.mutate()}
            loading={transferMutation.isPending}
            disabled={!toLocationId || quantity <= 0}
          >
            Transfer
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

export function RxInventoryPage() {
  const [stockBalanceId, setStockBalanceId] = useState('');
  const [deltaQuantity, setDeltaQuantity] = useState('');
  const [reason, setReason] = useState('');

  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [selectedBalance, setSelectedBalance] = useState<Record<string, unknown> | null>(null);

  const qc = useQueryClient();

  const adjustmentMutation = useMutation({
    mutationFn: async () => {
      await rxsoftApi.post('/inventory/adjustments', {
        stockBalanceId,
        deltaQuantity: Number(deltaQuantity),
        reason,
      });
    },
    onSuccess: () => {
      notifications.show({ message: 'Adjustment posted successfully.', color: 'green' });
      qc.invalidateQueries({ queryKey: ['rxsoft-data-page'] });
      setStockBalanceId('');
      setDeltaQuantity('');
      setReason('');
    },
    onError: () => {
      notifications.show({ message: 'Failed to post adjustment.', color: 'red' });
    },
  });

  const { data: balancesData } = useQuery({
    queryKey: ['rxsoft-data-page', '/inventory/stock-balances'],
    queryFn: async () => {
      const { data } = await rxsoftApi.get('/inventory/stock-balances', { params: { limit: 50 } });
      return data?.data ?? [];
    },
  });

  const balances = Array.isArray(balancesData) ? balancesData : [];

  return (
    <RxPage
      title="Inventory"
      description="Stock balances, movement history, and manual adjustments."
    >
      <Stack gap="xl">
        {/* STOCK BALANCES */}
        <Card withBorder p="md">
          <Stack gap="sm">
            <Text fw={600}>Stock Balances</Text>
            {balances.length === 0 ? (
              <Text c="dimmed" size="sm">No stock balances found.</Text>
            ) : (
              <Table striped withTableBorder withColumnBorders>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Item</Table.Th>
                    <Table.Th>Location</Table.Th>
                    <Table.Th>On Hand</Table.Th>
                    <Table.Th>Reserved</Table.Th>
                    <Table.Th>Available</Table.Th>
                    <Table.Th w={80}></Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {balances.map((b: any) => {
                    const available = Number(b.quantityOnHand ?? 0) - Number(b.quantityReserved ?? 0);
                    return (
                      <Table.Tr key={b.id}>
                        <Table.Td>{b.item?.name ?? b.itemId}</Table.Td>
                        <Table.Td>{b.location?.name ?? b.locationId}</Table.Td>
                        <Table.Td>{b.quantityOnHand ?? 0}</Table.Td>
                        <Table.Td>{b.quantityReserved ?? 0}</Table.Td>
                        <Table.Td>
                          <Badge color={available > 0 ? 'green' : 'red'}>{available}</Badge>
                        </Table.Td>
                        <Table.Td>
                          <Button
                            size="compact-xs"
                            variant="light"
                            leftSection={<ArrowRight size={14} />}
                            onClick={() => {
                              setSelectedBalance(b);
                              setTransferModalOpen(true);
                            }}
                          >
                            Transfer
                          </Button>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
            )}
          </Stack>
        </Card>

        <TransferModal
          opened={transferModalOpen}
          onClose={() => {
            setTransferModalOpen(false);
            setSelectedBalance(null);
          }}
          balance={selectedBalance}
        />

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
