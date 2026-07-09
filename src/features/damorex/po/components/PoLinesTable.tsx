import { ActionIcon, Button, Group, Modal, NumberInput, Select, Stack, Table, Text, Tooltip } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { Check, DollarSign, Save, Trash2, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { rxsoftApi } from '@/lib/rxsoft-api';
import { convertPriceBetweenUoms } from '@/lib/uom-utils';
import { useItems, useItemUoms } from '../api/poApi';
import { PoLineItem, PurchaseOrderStatus } from '../types';

interface Props {
  lines: PoLineItem[];
  status: PurchaseOrderStatus | null;
  pendingPoId: string | null;
  receiptNumber: string;
  onUpdateLine: (id: string, updates: Partial<PoLineItem>) => void;
  onRemoveLine: (id: string) => void;
  onAddLine: () => void;
  onSaveLine: (line: PoLineItem) => void;
  onReceiveLine: (line: PoLineItem) => void;
  onUnpostLine: (line: PoLineItem) => void;
  onSetPrice: (line: PoLineItem) => void;
  savingLines: Set<string>;
}

interface UomData {
  id: string;
  name: string;
  code?: string;
  factor: number;
  categoryId?: string;
}

function UomSelect({
  itemId,
  value,
  disabled,
  onRequestChange,
}: {
  itemId: string;
  value: string;
  disabled: boolean;
  onRequestChange: (oldId: string, newId: string, uoms: UomData[]) => void;
}) {
  const { data: uoms = [], isLoading } = useItemUoms(itemId || null);
  const opts = (Array.isArray(uoms) ? uoms : []).map((u: any) => ({
    value: u.id,
    label: `${u.name || u.code || u.id}`,
  }));

  return (
    <Select
      size="xs"
      placeholder={isLoading ? 'Loading...' : 'UOM'}
      data={opts}
      value={value || null}
      onChange={(v) => {
        if (v && v !== value) {
          onRequestChange(value, v, Array.isArray(uoms) ? uoms : []);
        }
      }}
      searchable
      clearable
      w={100}
      disabled={disabled || !itemId}
    />
  );
}

function UomChangeModal({
  opened,
  onClose,
  onConfirm,
  uomMap,
  oldUomId,
  newUomId,
}: {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  uomMap: Map<string, UomData>;
  oldUomId: string;
  newUomId: string;
}) {
  const oldUom = uomMap.get(oldUomId);
  const newUom = uomMap.get(newUomId);

  const sameCategory =
    oldUom?.categoryId && newUom?.categoryId
      ? oldUom.categoryId === newUom.categoryId
      : null;

  const conversionText =
    oldUom && newUom && oldUom.factor && newUom.factor
      ? `1 ${oldUom.name} = ${(newUom.factor / oldUom.factor).toFixed(4)} ${newUom.name}`
      : null;

  return (
    <Modal opened={opened} onClose={onClose} title="Change Unit of Measure" centered>
      <Stack>
        <Text>
          Change UOM from <strong>{oldUom?.name || oldUomId}</strong> to{' '}
          <strong>{newUom?.name || newUomId}</strong>?
        </Text>
        {conversionText && (
          <Text size="sm" c="dimmed">
            Conversion: {conversionText}
          </Text>
        )}
        {sameCategory === false && (
          <Text size="sm" c="red">
            Cannot change: UOMs are not in the same category.
          </Text>
        )}
        <Group justify="flex-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={sameCategory === false}>
            Confirm
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

interface PriceListItem {
  id: string;
  unitPrice: number;
  currencyCode: string;
  priceList: { id: string; code: string; name: string };
}

function PriceListCell({ itemId }: { itemId: string }) {
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['price-list-items', itemId],
    queryFn: async () => {
      if (!itemId) return [];
      const { data } = await rxsoftApi.get('/price-lists/items', {
        params: { itemId, limit: 10 },
      });
      return (data?.data ?? data ?? []) as PriceListItem[];
    },
    enabled: !!itemId,
  });

  if (!itemId) return <Text size="xs" c="dimmed">—</Text>;
  if (isLoading) return <Text size="xs" c="dimmed">Loading...</Text>;
  if (!items.length) return <Text size="xs" c="dimmed">No prices</Text>;

  return (
    <Stack gap={2}>
      {items.map((p) => (
        <Text key={p.id} size="xs">
          {p.priceList?.name || p.priceList?.code}: {p.currencyCode} {p.unitPrice}
        </Text>
      ))}
    </Stack>
  );
}

export function PoLinesTable({
  lines,
  status,
  pendingPoId,
  receiptNumber,
  onUpdateLine,
  onRemoveLine,
  onAddLine,
  onSaveLine,
  onReceiveLine,
  onUnpostLine,
  onSetPrice,
  savingLines,
}: Props) {
  const [itemSearch, setItemSearch] = useState('');
  const { data: items = [] } = useItems(itemSearch);

  const [pendingUom, setPendingUom] = useState<{
    lineId: string;
    oldUomId: string;
    newUomId: string;
  } | null>(null);

  const { data: allUoms = [] } = useQuery({
    queryKey: ['uoms', 'all'],
    queryFn: async () => {
      const { data } = await rxsoftApi.get('/uoms', { params: { limit: 100 } });
      return (data?.data ?? data ?? []) as UomData[];
    },
    staleTime: 300_000,
  });

  const uomMap = useMemo(() => {
    const map = new Map<string, UomData>();
    for (const u of allUoms) {map.set(u.id, u);}
    return map;
  }, [allUoms]);

  const usedItemIds = useMemo(
    () => lines.filter((l) => l.serverLineId).map((l) => l.itemId).filter(Boolean),
    [lines],
  );

  const itemOpts = (Array.isArray(items) ? items : []).map((i: any) => ({
    value: i.id,
    label: `${i.code || ''} ${i.name || ''}`,
  }));

  const isReadOnly = status === 'received' || status === 'cancelled';

  return (
    <>
      <Table withTableBorder withColumnBorders>
        <Table.Thead bg="#a6d5e5">
          <Table.Tr>
            <Table.Th>Item</Table.Th>
            <Table.Th>UOM</Table.Th>
            <Table.Th>Ordered Qty</Table.Th>
            <Table.Th>Received Qty</Table.Th>
            <Table.Th>Unit Cost</Table.Th>
            <Table.Th>Price List</Table.Th>
            <Table.Th>Subtotal</Table.Th>
            <Table.Th>Total</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {lines.map((line) => {
            const isSaved = !!line.serverLineId;
            const isFullyReceived = isSaved && Number(line.receivedQty) >= Number(line.orderedQty);

            const isDraftStatus = !status || status === 'draft';
            const isApprovedStatus = status === 'approved';
            const isPartiallyReceivedStatus = status === 'partially_received';

            const itemEditable = isDraftStatus && !isSaved;
            const uomEditable = isDraftStatus;
            const recvQtyEditable =
              (isApprovedStatus || isPartiallyReceivedStatus) && !isFullyReceived;
            const costEditable =
              (isApprovedStatus || isPartiallyReceivedStatus) && !isFullyReceived;

            const canDelete = !isReadOnly && isDraftStatus && lines.length > 1;
            const canSave = !isReadOnly && isDraftStatus && !isSaved && !!pendingPoId;
            const canReceive = !isReadOnly && isSaved && line.receivedQty > 0 && !line.isPosted &&
              (isApprovedStatus || isPartiallyReceivedStatus);
            const canUnpost = !isReadOnly && isSaved && line.isPosted;

            const filteredItemOpts = itemOpts.filter(
              (o) => o.value === line.itemId || !usedItemIds.includes(o.value),
            );

            const showItemLabel = line.itemId && !itemOpts.some((o) => o.value === line.itemId)
              ? `${line.itemCode || ''} ${line.itemName || ''}`.trim() || line.itemId
              : null;

            const isSaving = savingLines.has(line.id);

            return (
              <Table.Tr key={line.id}>
                <Table.Td>
                  {itemEditable ? (
                    <Select
                      size="xs"
                      placeholder="Select item"
                      data={showItemLabel
                        ? [{ value: line.itemId, label: showItemLabel }, ...filteredItemOpts]
                        : filteredItemOpts}
                      value={line.itemId || null}
                      onChange={(v) => {
                        onUpdateLine(line.id, { itemId: v || '' });
                        const item = (Array.isArray(items) ? items : []).find((i: any) => i.id === v);
                        if (item) {
                          onUpdateLine(line.id, {
                            itemCode: item.code,
                            itemName: item.name,
                            uomId: item.purchaseUom?.id || item.purchaseUomId || '',
                          });
                        }
                      }}
                      onSearchChange={setItemSearch}
                      searchable
                      clearable
                      w={220}
                    />
                  ) : (
                    <Text size="xs">{line.itemName || line.itemCode || line.itemId}</Text>
                  )}
                </Table.Td>
                <Table.Td>
                  <UomSelect
                    itemId={line.itemId}
                    value={line.uomId}
                    disabled={!uomEditable || (isSaved && !isDraftStatus)}
                    onRequestChange={(oldId, newId) =>
                      setPendingUom({ lineId: line.id, oldUomId: oldId, newUomId: newId })
                    }
                  />
                </Table.Td>
                <Table.Td>
                  <Text size="xs">{line.orderedQty}</Text>
                </Table.Td>
                <Table.Td>
                  <NumberInput
                    size="xs"
                    min={0}
                    value={line.receivedQty}
                    onChange={(v) => onUpdateLine(line.id, { receivedQty: Number(v) || 0 })}
                    w={80}
                    disabled={!recvQtyEditable}
                  />
                </Table.Td>
                <Table.Td>
                  <NumberInput
                    size="xs"
                    min={0}
                    value={line.unitCost}
                    onChange={(v) => onUpdateLine(line.id, { unitCost: Number(v) || 0 })}
                    w={90}
                    decimalScale={2}
                    disabled={!costEditable}
                  />
                </Table.Td>
                <Table.Td>
                  <PriceListCell itemId={line.itemId} />
                </Table.Td>
                <Table.Td>
                  <Text size="xs">{line.lineSubtotal.toFixed(2)}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="xs" fw={700}>{line.lineTotal.toFixed(2)}</Text>
                </Table.Td>
                <Table.Td>
                  {canSave && (
                    <Tooltip label="Save line to backend">
                      <ActionIcon
                        size="sm"
                        color="blue"
                        variant="light"
                        onClick={() => onSaveLine(line)}
                        loading={isSaving}
                      >
                        <Save size={14} />
                      </ActionIcon>
                    </Tooltip>
                  )}
                  {isSaved && !isReadOnly && (
                    <Tooltip label="Set price">
                      <ActionIcon size="sm" color="cyan" variant="light" onClick={() => onSetPrice(line)}>
                        <DollarSign size={14} />
                      </ActionIcon>
                    </Tooltip>
                  )}
                  {canReceive && (
                    <Tooltip label={receiptNumber ? 'Receive' : 'Enter a receipt number first'}>
                      <ActionIcon size="sm" color="green" variant="light" onClick={() => onReceiveLine(line)} disabled={!receiptNumber}>
                        <Check size={14} />
                      </ActionIcon>
                    </Tooltip>
                  )}
                  {canUnpost && (
                    <Tooltip label="Unpost">
                      <ActionIcon size="sm" color="orange" variant="light" onClick={() => onUnpostLine(line)}>
                        <X size={14} />
                      </ActionIcon>
                    </Tooltip>
                  )}
                  {canDelete && (
                    <Tooltip label="Delete">
                      <ActionIcon size="sm" color="red" variant="light" onClick={() => onRemoveLine(line.id)}>
                        <Trash2 size={14} />
                      </ActionIcon>
                    </Tooltip>
                  )}
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>

      <UomChangeModal
        opened={!!pendingUom}
        onClose={() => setPendingUom(null)}
        onConfirm={() => {
          if (pendingUom) {
            const oldUom = uomMap.get(pendingUom.oldUomId);
            const newUom = uomMap.get(pendingUom.newUomId);
            const line = lines.find((l) => l.id === pendingUom.lineId);
            const updates: Partial<PoLineItem> = { uomId: pendingUom.newUomId };
            if (line && oldUom && newUom) {
              updates.unitCost = +convertPriceBetweenUoms(line.unitCost, oldUom, newUom).toFixed(4);
            }
            onUpdateLine(pendingUom.lineId, updates);
            setPendingUom(null);
          }
        }}
        uomMap={uomMap}
        oldUomId={pendingUom?.oldUomId ?? ''}
        newUomId={pendingUom?.newUomId ?? ''}
      />
    </>
  );
}
