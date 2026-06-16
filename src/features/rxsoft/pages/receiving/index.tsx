import { Badge, Button, Card, Group, Modal, Stack, Table, Text, TextInput, PasswordInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { PackageSearch, Rotate3D } from 'lucide-react';
import { rxsoftApi } from '@/lib/rxsoft-api';
import { RxPage } from '../../../components/page/rx-page';

function ReceiptDetailModal({
  receipt, opened, onClose, onUnposted,
}: {
  receipt: any; opened: boolean; onClose: () => void; onUnposted: () => void;
}) {
  const [password, setPassword] = useState('');
  const [unpostLineId, setUnpostLineId] = useState<string | null>(null);

  const unpostMutation = useMutation({
    mutationFn: async () => {
      await rxsoftApi.post(`/purchases/${receipt.purchaseOrder?.id ?? receipt.purchaseOrderId}/unpost`, {
        receiptLineId: unpostLineId,
        password,
      });
    },
    onSuccess: () => {
      notifications.show({ message: 'Line unposted successfully.', color: 'green' });
      onUnposted();
      setUnpostLineId(null);
      setPassword('');
    },
    onError: (err: any) => {
      notifications.show({ message: err?.response?.data?.message ?? 'Unpost failed.', color: 'red' });
    },
  });

  return (
    <Modal opened={opened} onClose={onClose} title={`Receipt #${receipt?.receiptNumber ?? ''}`} size="lg" centered>
      <Stack>
        <Group>
          <Text size="sm"><b>PO:</b> {receipt?.purchaseOrder?.purchaseOrderNumber ?? receipt?.purchaseOrderId}</Text>
          <Text size="sm"><b>Date:</b> {receipt?.receivedDate ? new Date(receipt.receivedDate).toLocaleDateString() : '-'}</Text>
          {receipt?.note && <Text size="sm"><b>Note:</b> {receipt.note}</Text>}
        </Group>

        <Table striped withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Item</Table.Th>
              <Table.Th>Ordered</Table.Th>
              <Table.Th>Received</Table.Th>
              <Table.Th>UOM</Table.Th>
              <Table.Th>Unit Cost</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {(receipt?.lines ?? []).map((l: any) => (
              <Table.Tr key={l.id}>
                <Table.Td>{l.item?.name ?? l.itemId}</Table.Td>
                <Table.Td>{l.orderedQty}</Table.Td>
                <Table.Td>{l.receivedQty}</Table.Td>
                <Table.Td>{l.uom?.code ?? l.uomId}</Table.Td>
                <Table.Td>{(+l.unitCost).toLocaleString()}</Table.Td>
                <Table.Td>
                  {l.isUnposted ? (
                    <Badge color="red">Unposted</Badge>
                  ) : (
                    <Badge color="green">Active</Badge>
                  )}
                </Table.Td>
                <Table.Td>
                  {!l.isUnposted && (
                    <Button
                      size="compact-xs" variant="light" color="orange"
                      onClick={() => setUnpostLineId(l.id)}
                      loading={unpostMutation.isPending && unpostLineId === l.id}
                    >
                      Unpost
                    </Button>
                  )}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        {unpostLineId && (
          <Group>
            <PasswordInput
              label="Unpost Password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              required
            />
            <Button
              color="orange"
              onClick={() => unpostMutation.mutate()}
              loading={unpostMutation.isPending}
              disabled={!password}
            >
              Confirm Unpost
            </Button>
            <Button variant="light" onClick={() => { setUnpostLineId(null); setPassword(''); }}>
              Cancel
            </Button>
          </Group>
        )}
      </Stack>
    </Modal>
  );
}

export function RxReceivingPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const limit = 20;

  const { data: receiptsData, isLoading } = useQuery({
    queryKey: ['goods-receipts', page],
    queryFn: async () => {
      const { data } = await rxsoftApi.get('/receipts', { params: { page, limit } });
      return data;
    },
  });

  const receipts: any[] = receiptsData?.data ?? [];
  const total = receiptsData?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <RxPage title="Goods Receiving" description="View and manage goods receipts from purchase orders.">
      <Stack gap="md">
        <Card withBorder p="md">
          <Group mb="sm">
            <TextInput
              placeholder="Search by receipt number..."
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              style={{ width: 300 }}
            />
          </Group>

          {isLoading ? (
            <Text c="dimmed" size="sm">Loading...</Text>
          ) : receipts.length === 0 ? (
            <Text c="dimmed" size="sm">No goods receipts found.</Text>
          ) : (
            <>
              <Table striped withTableBorder withColumnBorders>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Receipt #</Table.Th>
                    <Table.Th>PO #</Table.Th>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Items</Table.Th>
                    <Table.Th>Note</Table.Th>
                    <Table.Th></Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {receipts.map((r: any) => (
                    <Table.Tr key={r.id}>
                      <Table.Td>{r.receiptNumber}</Table.Td>
                      <Table.Td>{r.purchaseOrder?.purchaseOrderNumber ?? r.purchaseOrderId?.slice(0, 8)}</Table.Td>
                      <Table.Td>{r.receivedDate ? new Date(r.receivedDate).toLocaleDateString() : '-'}</Table.Td>
                      <Table.Td>{r.lines?.length ?? 0}</Table.Td>
                      <Table.Td>{r.note ?? '-'}</Table.Td>
                      <Table.Td>
                        <Button
                          size="compact-xs" variant="light"
                          leftSection={<PackageSearch size={14} />}
                          onClick={() => {
                            setSelectedReceipt(r);
                            setDetailOpen(true);
                          }}
                        >
                          View
                        </Button>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>

              {totalPages > 1 && (
                <Group justify="center" mt="md">
                  <Button variant="light" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                    Previous
                  </Button>
                  <Text size="sm">Page {page} of {totalPages}</Text>
                  <Button variant="light" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                    Next
                  </Button>
                </Group>
              )}
            </>
          )}
        </Card>
      </Stack>

      <ReceiptDetailModal
        receipt={selectedReceipt}
        opened={detailOpen}
        onClose={() => { setDetailOpen(false); setSelectedReceipt(null); }}
        onUnposted={() => {
          qc.invalidateQueries({ queryKey: ['goods-receipts'] });
        }}
      />
    </RxPage>
  );
}
