import {
  Badge,
  Button,
  Group,
  Modal,
  NumberInput,
  Paper,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useState } from 'react';
import { usePurchaseOrders, useReceiveGoods, useReceipts, useItems } from '../api/poApi';

export function InflowList() {
  const [selectedPoId, setSelectedPoId] = useState<string | null>(null);
  const [receiveModal, setReceiveModal] = useState(false);
  const [receiveLines, setReceiveLines] = useState<Record<string, number>>({});

  const { data: orders = [] } = usePurchaseOrders();
  const { data: receipts = [] } = useReceipts(selectedPoId || undefined);
  const { data: items = [] } = useItems('');

  const receiveMutation = useReceiveGoods();

  const pendingOrders = (Array.isArray(orders) ? orders : []).filter(
    (o: any) => o.status === 'approved' || o.status === 'partially_received'
  );

  function handleOpenReceive(po: any) {
    setSelectedPoId(po.id);
    const initial: Record<string, number> = {};
    (po.lines || []).forEach((line: any) => {
      initial[line.itemId] = line.receivedQty || 0;
    });
    setReceiveLines(initial);
    setReceiveModal(true);
  }

  async function handleReceive() {
    if (!selectedPoId) return;
    const payload = {
      note: null,
      lines: Object.entries(receiveLines).map(([itemId, receivedQty]) => {
        const po = (Array.isArray(orders) ? orders : []).find((o: any) => o.id === selectedPoId);
        const line = (po?.lines || []).find((l: any) => l.itemId === itemId);
        return {
          itemId,
          receivedQty,
          unitCost: line?.unitCost || 0,
          uomId: line?.uomId || '',
        };
      }),
    };
    await receiveMutation.mutateAsync({ poId: selectedPoId, payload });
    setReceiveModal(false);
    setSelectedPoId(null);
  }

  const itemMap = new Map((Array.isArray(items) ? items : []).map((i: any) => [i.id, i]));

  return (
    <Stack p="md">
      <Paper p="sm" withBorder bg="#d9edf5">
        <Title order={4}>Pending Purchase Orders</Title>
      </Paper>

      <Paper withBorder>
        <Table withTableBorder withColumnBorders>
          <Table.Thead bg="#a6d5e5">
            <Table.Tr>
              <Table.Th>PO Number</Table.Th>
              <Table.Th>Supplier</Table.Th>
              <Table.Th>Date</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Total</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {pendingOrders.map((po: any) => (
              <Table.Tr key={po.id}>
                <Table.Td>{po.purchaseOrderNumber || po.invoiceNumber}</Table.Td>
                <Table.Td>{po.supplierId?.slice(0, 8)}</Table.Td>
                <Table.Td>{po.orderDate}</Table.Td>
                <Table.Td>
                  <Badge color={po.status === 'approved' ? 'blue' : 'yellow'}>{po.status}</Badge>
                </Table.Td>
                <Table.Td>${Number(po.totalCost || po.totalAmount || 0).toFixed(2)}</Table.Td>
                <Table.Td>
                  <Button size="xs" onClick={() => handleOpenReceive(po)}>
                    Receive
                  </Button>
                </Table.Td>
              </Table.Tr>
            ))}
            {pendingOrders.length === 0 && (
              <Table.Tr>
                <Table.Td colSpan={6} ta="center">
                  No pending purchase orders
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Paper>

      <Paper p="sm" withBorder bg="#d9edf5" mt="md">
        <Title order={4}>Goods Receipts</Title>
      </Paper>

      <Paper withBorder>
        <Table withTableBorder withColumnBorders>
          <Table.Thead bg="#a6d5e5">
            <Table.Tr>
              <Table.Th>Receipt #</Table.Th>
              <Table.Th>PO #</Table.Th>
              <Table.Th>Date</Table.Th>
              <Table.Th>Items</Table.Th>
              <Table.Th>Note</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {(Array.isArray(receipts) ? receipts : []).map((r: any) => (
              <Table.Tr key={r.id}>
                <Table.Td>{r.receiptNumber}</Table.Td>
                <Table.Td>{r.purchaseOrderNumber || r.purchaseOrderId?.slice(0, 8)}</Table.Td>
                <Table.Td>{r.receivedDate || r.createdAt}</Table.Td>
                <Table.Td>{(r.lines || []).length}</Table.Td>
                <Table.Td>{r.note || '-'}</Table.Td>
              </Table.Tr>
            ))}
            {(Array.isArray(receipts) ? receipts : []).length === 0 && (
              <Table.Tr>
                <Table.Td colSpan={5} ta="center">
                  No receipts yet
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Paper>

      <Modal
        opened={receiveModal}
        onClose={() => setReceiveModal(false)}
        title="Receive Goods"
        size="lg"
      >
        <Stack>
          <Text fw={600}>Enter received quantities per item:</Text>
          {Object.entries(receiveLines).map(([itemId, qty]) => (
            <Group key={itemId} grow>
              <Text size="sm">{itemMap.get(itemId)?.name || itemId}</Text>
              <NumberInput
                value={qty}
                onChange={(v) => setReceiveLines((prev) => ({ ...prev, [itemId]: Number(v) || 0 }))}
                min={0}
              />
            </Group>
          ))}
          <Group grow>
            <Button loading={receiveMutation.isPending} onClick={handleReceive}>
              Confirm Receipt
            </Button>
            <Button variant="light" onClick={() => setReceiveModal(false)}>
              Cancel
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
