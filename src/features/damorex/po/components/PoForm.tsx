import {
  Button,
  Group,
  NumberInput,
  Paper,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { Plus, Trash2, Send } from 'lucide-react';
import { useState } from 'react';
import { useCreatePurchaseOrder, useSuppliers, useWarehouses, useItems } from '../api/poApi';
import { usePoStore } from '../store/usePoStore';

export function PoForm() {
  const {
    supplierId,
    supplierName,
    warehouseId,
    warehouseName,
    expectedDate,
    note,
    lines,
    setSupplier,
    setWarehouse,
    setExpectedDate,
    setNote,
    addLine,
    updateLine,
    removeLine,
    reset,
  } = usePoStore();

  const [supplierSearch, setSupplierSearch] = useState('');
  const [warehouseSearch, setWarehouseSearch] = useState('');
  const [itemSearch, setItemSearch] = useState<Record<string, string>>({});

  const { data: suppliers = [] } = useSuppliers(supplierSearch);
  const { data: warehouses = [] } = useWarehouses(warehouseSearch);
  const { data: items = [] } = useItems('');

  const createMutation = useCreatePurchaseOrder();

  const supplierOptions = (Array.isArray(suppliers) ? suppliers : []).map((s: any) => ({
    value: s.id,
    label: s.name,
  }));
  const warehouseOptions = (Array.isArray(warehouses) ? warehouses : []).map((w: any) => ({
    value: w.id,
    label: w.name,
  }));
  const itemOptions = (Array.isArray(items) ? items : []).map((i: any) => ({
    value: i.id,
    label: `${i.code || ''} ${i.name || ''}`,
  }));

  const totalAmount = lines.reduce((sum, l) => sum + l.lineTotal, 0);

  async function handleSubmit(status: 'draft' | 'approved' = 'draft') {
    const payload = {
      supplierId,
      warehouseId,
      expectedDate: expectedDate || undefined,
      note: note || undefined,
      status,
      lines: lines.map((l) => ({
        itemId: l.itemId,
        orderedQty: l.orderedQty,
        uomId: l.uomId || undefined,
        unitCost: l.unitCost,
        discountPercent: l.discountPercent,
        taxPercent: l.taxPercent,
      })),
    };
    await createMutation.mutateAsync(payload);
    reset();
  }

  return (
    <Stack p="md" gap="sm">
      <Paper p="sm" withBorder bg="#d9edf5">
        <Group>
          <Select
            label="Supplier"
            placeholder="Select supplier"
            data={supplierOptions}
            value={supplierId || null}
            onChange={(v, opt) => {
              if (v) setSupplier(v, opt.label);
            }}
            onSearchChange={setSupplierSearch}
            searchable
            clearable
            w={250}
          />
          <Select
            label="Warehouse"
            placeholder="Select warehouse"
            data={warehouseOptions}
            value={warehouseId || null}
            onChange={(v, opt) => {
              if (v) setWarehouse(v, opt.label);
            }}
            onSearchChange={setWarehouseSearch}
            searchable
            clearable
            w={250}
          />
          <TextInput
            label="Expected Date"
            type="date"
            value={expectedDate}
            onChange={(e) => setExpectedDate(e.currentTarget.value)}
            w={180}
          />
          <TextInput
            label="Note"
            value={note}
            onChange={(e) => setNote(e.currentTarget.value)}
            w={250}
          />
        </Group>
      </Paper>

      <Paper withBorder>
        <Table withTableBorder withColumnBorders>
          <Table.Thead bg="#a6d5e5">
            <Table.Tr>
              <Table.Th>Item</Table.Th>
              <Table.Th>Qty</Table.Th>
              <Table.Th>UoM</Table.Th>
              <Table.Th>Unit Cost</Table.Th>
              <Table.Th>Discount %</Table.Th>
              <Table.Th>Tax %</Table.Th>
              <Table.Th>Subtotal</Table.Th>
              <Table.Th>Total</Table.Th>
              <Table.Th></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {lines.map((line) => (
              <Table.Tr key={line.id}>
                <Table.Td>
                  <Select
                    size="xs"
                    placeholder="Select item"
                    data={itemOptions}
                    value={line.itemId || null}
                    onChange={(v) => {
                      updateLine(line.id, { itemId: v || '' });
                      const item = (Array.isArray(items) ? items : []).find((i: any) => i.id === v);
                      if (item)
                        updateLine(line.id, {
                          itemCode: item.code,
                          itemName: item.name,
                          uomId: item.saleUomId || '',
                        });
                    }}
                    searchable
                    clearable
                    w={220}
                  />
                </Table.Td>
                <Table.Td>
                  <NumberInput
                    size="xs"
                    min={0.001}
                    value={line.orderedQty}
                    onChange={(v) => updateLine(line.id, { orderedQty: Number(v) || 0 })}
                    w={80}
                  />
                </Table.Td>
                <Table.Td>
                  <Text size="xs">{line.uomId?.slice(0, 8) || 'Unit'}</Text>
                </Table.Td>
                <Table.Td>
                  <NumberInput
                    size="xs"
                    min={0}
                    value={line.unitCost}
                    onChange={(v) => updateLine(line.id, { unitCost: Number(v) || 0 })}
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
                    onChange={(v) => updateLine(line.id, { discountPercent: Number(v) || 0 })}
                    w={70}
                  />
                </Table.Td>
                <Table.Td>
                  <NumberInput
                    size="xs"
                    min={0}
                    max={100}
                    value={line.taxPercent}
                    onChange={(v) => updateLine(line.id, { taxPercent: Number(v) || 0 })}
                    w={70}
                  />
                </Table.Td>
                <Table.Td>{line.lineSubtotal.toFixed(2)}</Table.Td>
                <Table.Td fw={700}>{line.lineTotal.toFixed(2)}</Table.Td>
                <Table.Td>
                  <Button
                    size="xs"
                    color="red"
                    variant="subtle"
                    onClick={() => removeLine(line.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        <Group p="xs">
          <Button
            size="xs"
            leftSection={<Plus size={14} />}
            onClick={() =>
              addLine({
                id: crypto.randomUUID(),
                itemId: '',
                orderedQty: 1,
                receivedQty: 0,
                uomId: '',
                unitCost: 0,
                discountPercent: 0,
                taxPercent: 0,
                lineSubtotal: 0,
                lineTotal: 0,
              })
            }
          >
            Add Line
          </Button>
        </Group>
      </Paper>

      <Paper p="md" withBorder bg="#c7e6f1">
        <Group justify="space-between">
          <Title order={3}>Total: ${totalAmount.toFixed(2)}</Title>
          <Group>
            <Button
              leftSection={<Send size={16} />}
              onClick={() => handleSubmit('draft')}
              loading={createMutation.isPending}
            >
              Save as Draft
            </Button>
            <Button
              color="green"
              leftSection={<Send size={16} />}
              onClick={() => handleSubmit('approved')}
              loading={createMutation.isPending}
            >
              Submit & Approve
            </Button>
          </Group>
        </Group>
      </Paper>
    </Stack>
  );
}
