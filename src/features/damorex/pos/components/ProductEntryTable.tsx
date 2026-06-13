import { Button, Checkbox, Group, NumberInput, Paper, Select, Table, Text } from '@mantine/core';
import { Plus } from 'lucide-react';
import { useState, useMemo } from 'react';
import { usePriceListItems } from '../../api/posApi';
import { SaleSession, CartItem } from '../types';

interface Props {
  session: SaleSession;
  onAddToCart: (item: CartItem) => void;
}

export function ProductEntryTable({ session, onAddToCart }: Props) {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [uomId, setUomId] = useState<string | null>(null);
  const [uomName, setUomName] = useState('');

  const { data: priceListItems = [] } = usePriceListItems(session.priceListId);

  const productOptions = useMemo(() => {
    console.log({ productOptions: priceListItems.map((o) => o.item.id) });
    return (Array.isArray(priceListItems) ? priceListItems : []).map((pli: any) => ({
      value: pli.item?.id || pli.id,
      label: `${pli.item?.code || ''} - ${pli.item?.name || ''}`,
      item: pli.item,
      retailPrice: pli.unitPrice,
      wholesalePrice: pli.unitPrice,
      uomId: pli.item?.saleUomId || pli.uomId || '',
      uomName: pli.item?.saleUomName || 'Unit',
    }));
  }, [priceListItems]);

  const selectedProduct = productOptions.find((p: any) => p.value === selectedProductId);

  const itemCode = selectedProduct?.item?.code || selectedProductId?.slice(0, 8) || '';
  const retailPrice = selectedProduct?.retailPrice || 0;
  const wholesalePrice = selectedProduct?.wholesalePrice || 0;
  const effectivePrice = session.pricingMode === 'wholesale' ? wholesalePrice : retailPrice;
  const total = quantity * effectivePrice;

  function handleAdd() {
    if (!selectedProductId || !quantity) return;
    const item: CartItem = {
      id: selectedProductId,
      code: itemCode,
      name: selectedProduct?.label || '',
      retailPrice,
      wholesalePrice,
      quantity,
      uomId: uomId || selectedProduct?.uomId || '',
      uomName: uomName || selectedProduct?.uomName || 'Unit',
      uomFactor: 1,
      lineTotal: total,
    };
    onAddToCart(item);
    setSelectedProductId(null);
    setQuantity(1);
  }

  return (
    <Paper radius={0} withBorder>
      <Table striped withTableBorder withColumnBorders horizontalSpacing="xs" verticalSpacing={4}>
        <Table.Thead bg="#a6d5e5">
          <Table.Tr>
            <Table.Th w={40}>No</Table.Th>
            <Table.Th>ITEM CODE</Table.Th>
            <Table.Th>ITEM NAME</Table.Th>
            <Table.Th>RtPrice</Table.Th>
            <Table.Th>WSPrice</Table.Th>
            <Table.Th>UOM</Table.Th>
            <Table.Th>QUANTITY</Table.Th>
            <Table.Th>TOTAL</Table.Th>
            <Table.Th w={60}></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td>
              <Checkbox />
            </Table.Td>
            <Table.Td>{itemCode || '-'}</Table.Td>
            <Table.Td>
              <Select
                size="xs"
                placeholder="Select product..."
                data={productOptions.map((p: any) => ({ value: p.value, label: p.label }))}
                value={selectedProductId}
                onChange={(v) => {
                  setSelectedProductId(v);
                  const prod = productOptions.find((p: any) => p.value === v);
                  if (prod) {
                    setUomId(prod.uomId);
                    setUomName(prod.uomName);
                  }
                }}
                searchable
                clearable
                w={280}
              />
            </Table.Td>
            <Table.Td>{retailPrice}</Table.Td>
            <Table.Td>{wholesalePrice}</Table.Td>
            <Table.Td>
              <Select
                size="xs"
                data={[{ value: uomId || '', label: uomName || 'Unit' }]}
                value={uomId}
                onChange={(v) => setUomId(v)}
                w={80}
              />
            </Table.Td>
            <Table.Td>
              <NumberInput
                size="xs"
                min={1}
                value={quantity}
                onChange={(v) => setQuantity(Number(v) || 1)}
                w={80}
              />
            </Table.Td>
            <Table.Td fw={700}>{total.toFixed(2)}</Table.Td>
            <Table.Td>
              <Button size="xs" leftSection={<Plus size={14} />} onClick={handleAdd}>
                Add
              </Button>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
      <Text ta="center" c="blue" py="xs" fw={600}>
        Add to Cart
      </Text>
    </Paper>
  );
}
