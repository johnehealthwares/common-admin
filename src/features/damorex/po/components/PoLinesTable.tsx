import { ActionIcon, NumberInput, Select, Table, Text, Tooltip } from '@mantine/core';
import { Check, Trash2, X } from 'lucide-react';
import { useItems, useItemUoms } from '../api/poApi';
import { PoLineItem } from '../types';

interface Props {
  lines: PoLineItem[];
  onUpdateLine: (id: string, updates: Partial<PoLineItem>) => void;
  onRemoveLine: (id: string) => void;
  onAddLine: () => void;
  onPostLine: (line: PoLineItem) => void;
  onUnpostLine: (line: PoLineItem) => void;
}

function UomSelect({
  itemId,
  value,
  onChange,
}: {
  itemId: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const { data: uoms = [], isLoading } = useItemUoms(itemId || null);
  const opts = (Array.isArray(uoms) ? uoms : []).map((u: any) => ({
    value: u.id,
    label: `${u.code || u.name || u.id}`,
  }));

  return (
    <Select
      size="xs"
      placeholder={isLoading ? 'Loading...' : 'UOM'}
      data={opts}
      value={value || null}
      onChange={(v) => onChange(v || '')}
      searchable
      clearable
      w={100}
      disabled={!itemId}
    />
  );
}

export function PoLinesTable({ lines, onUpdateLine, onRemoveLine, onAddLine, onPostLine, onUnpostLine }: Props) {
  const { data: items = [] } = useItems('');

  const itemOpts = (Array.isArray(items) ? items : []).map((i: any) => ({
    value: i.id,
    label: `${i.code || ''} ${i.name || ''}`,
  }));

  return (
    <Table withTableBorder withColumnBorders>
      <Table.Thead bg="#a6d5e5">
        <Table.Tr>
          <Table.Th>Item</Table.Th>
          <Table.Th>UOM</Table.Th>
          <Table.Th>Ordered Qty</Table.Th>
          <Table.Th>Received Qty</Table.Th>
          <Table.Th>Purchase Cost</Table.Th>
          <Table.Th>Discount %</Table.Th>
          <Table.Th>Tax %</Table.Th>
          <Table.Th>Subtotal</Table.Th>
          <Table.Th>Total</Table.Th>
          <Table.Th>Actions</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {lines.map((line) => {
          const isExistingLine = !line.isDraft;
          const canPost = isExistingLine && !line.isPosted && line.receivedQty > 0;
          const canUnpost = isExistingLine && line.isPosted;
          const canDelete = line.isDraft && !line.isPosted;

          return (
            <Table.Tr key={line.id}>
              <Table.Td>
                <Select
                  size="xs"
                  placeholder="Select item"
                  data={itemOpts}
                  value={line.itemId || null}
                  onChange={(v) => {
                    onUpdateLine(line.id, { itemId: v || '' });
                    const item = (Array.isArray(items) ? items : []).find((i: any) => i.id === v);
                    if (item) {
                      onUpdateLine(line.id, {
                        itemCode: item.code,
                        itemName: item.name,
                        uomId: item.saleUomId || '',
                      });
                    }
                  }}
                  searchable
                  clearable
                  w={220}
                />
              </Table.Td>
              <Table.Td>
                <UomSelect
                  itemId={line.itemId}
                  value={line.uomId}
                  onChange={(v) => onUpdateLine(line.id, { uomId: v })}
                />
              </Table.Td>
              <Table.Td>
                <NumberInput
                  size="xs"
                  min={0.001}
                  value={line.orderedQty}
                  onChange={(v) => onUpdateLine(line.id, { orderedQty: Number(v) || 0 })}
                  w={80}
                  disabled={isExistingLine}
                />
              </Table.Td>
              <Table.Td>
                <NumberInput
                  size="xs"
                  min={0}
                  value={line.receivedQty}
                  onChange={(v) => onUpdateLine(line.id, { receivedQty: Number(v) || 0 })}
                  w={80}
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
                />
              </Table.Td>
              <Table.Td>
                <NumberInput
                  size="xs"
                  min={0}
                  max={100}
                  value={line.discountPercent}
                  onChange={(v) => onUpdateLine(line.id, { discountPercent: Number(v) || 0 })}
                  w={70}
                />
              </Table.Td>
              <Table.Td>
                <NumberInput
                  size="xs"
                  min={0}
                  max={100}
                  value={line.taxPercent}
                  onChange={(v) => onUpdateLine(line.id, { taxPercent: Number(v) || 0 })}
                  w={70}
                />
              </Table.Td>
              <Table.Td>
                <Text size="xs">{line.lineSubtotal.toFixed(2)}</Text>
              </Table.Td>
              <Table.Td>
                <Text size="xs" fw={700}>{line.lineTotal.toFixed(2)}</Text>
              </Table.Td>
              <Table.Td>
                {canPost && (
                  <Tooltip label="Post">
                    <ActionIcon size="sm" color="green" variant="light" onClick={() => onPostLine(line)}>
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
  );
}
