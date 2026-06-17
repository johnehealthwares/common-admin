import { Button, Checkbox, NumberInput, Paper, Select, Table, Text, UnstyledButton } from '@mantine/core';
import { Plus } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { rxsoftApi } from '@/lib/rxsoft-api';
import { usePriceListItems } from '../../api/posApi';
import { SaleSession, CartItem } from '../types';
import { StockAdjustModal } from './StockAdjustModal';

interface UomOption {
  id: string;
  name: string;
  code: string | null;
  factor: number;
  uomType: string;
}

interface Props {
  session: SaleSession;
  onAddToCart: (item: CartItem) => void;
  stockLocationId?: string | null;
}

export function ProductEntryTable({ session, onAddToCart, stockLocationId }: Props) {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [uomId, setUomId] = useState<string | null>(null);
  const [uomName, setUomName] = useState('');

  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [adjustItemId, setAdjustItemId] = useState('');
  const [adjustItemName, setAdjustItemName] = useState('');
  const [adjustUomName, setAdjustUomName] = useState('');
  const [adjustCurrentQty, setAdjustCurrentQty] = useState(0);

  const { data: priceListItems = [] } = usePriceListItems(session.priceListId);

  const { data: allUoms = [] } = useQuery({
    queryKey: ['uoms', 'all'],
    queryFn: async () => {
      const { data } = await rxsoftApi.get('/uoms', { params: { limit: 100 } });
      return (data?.data ?? data ?? []) as UomOption[];
    },
    staleTime: 300_000,
  });

  const uomMap = useMemo(() => {
    const map = new Map<string, UomOption>();
    for (const u of allUoms) map.set(u.id, u);
    return map;
  }, [allUoms]);

  const productOptions = useMemo(() => {
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

  const currentUom = uomId ? uomMap.get(uomId) : null;
  const uomFactor = currentUom?.factor ?? 1;
  const total = quantity * effectivePrice * uomFactor;

  const { data: stockQty = 0, refetch: refetchStock } = useQuery({
    queryKey: ['pos-stock-qty', selectedProductId, stockLocationId],
    queryFn: async () => {
      if (!selectedProductId || !stockLocationId) return 0;
      const { data: balances } = await rxsoftApi.get('/inventory/stock-balances', {
        params: { itemId: selectedProductId, locationId: stockLocationId, limit: 1 },
      });
      const list = (balances?.data ?? balances ?? []) as Record<string, any>[];
      return Number(list[0]?.quantityOnHand ?? 0);
    },
    enabled: !!selectedProductId && !!stockLocationId,
    staleTime: 30_000,
  });

  useEffect(() => {
    if (selectedProduct) {
      setUomId(selectedProduct.uomId);
      setUomName(selectedProduct.uomName);
    }
  }, [selectedProduct]);

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
      uomFactor,
      lineTotal: total,
    };
    onAddToCart(item);
    setSelectedProductId(null);
    setQuantity(1);
  }

  function openAdjustModal() {
    if (!selectedProductId || !stockLocationId) return;
    setAdjustItemId(selectedProductId);
    setAdjustItemName(selectedProduct?.label || itemCode);
    setAdjustUomName(uomName || selectedProduct?.uomName || 'Unit');
    setAdjustCurrentQty(stockQty);
    setAdjustModalOpen(true);
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
            <Table.Th>StockQty</Table.Th>
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
            <Table.Td>
              {stockLocationId && selectedProductId ? (
                <UnstyledButton
                  onClick={openAdjustModal}
                  style={{ textDecoration: 'underline', cursor: 'pointer' }}
                >
                  {stockQty}hello
                </UnstyledButton>
              ) : (
               <UnstyledButton
                  onClick={openAdjustModal}
                  style={{ textDecoration: 'underline', cursor: 'pointer' }}
                > Set Stock</UnstyledButton>
              )}
            </Table.Td>
            <Table.Td>
              <Select
                size="xs"
                data={Array.from(uomMap.values()).map((u) => ({
                  value: u.id,
                  label: u.name,
                }))}
                value={uomId}
                onChange={(v) => {
                  setUomId(v);
                  const u = v ? uomMap.get(v) : null;
                  if (u) setUomName(u.name);
                }}
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

      <StockAdjustModal
        opened={adjustModalOpen}
        onClose={() => setAdjustModalOpen(false)}
        itemId={adjustItemId}
        itemName={adjustItemName}
        stockLocationId={stockLocationId ?? ''}
        currentQty={adjustCurrentQty}
        onAdjusted={() => refetchStock()}
        uomName={adjustUomName}
      />
    </Paper>
  );
}
