import { ActionIcon, NumberInput, Paper, ScrollArea, Table } from '@mantine/core';
import { Trash2 } from 'lucide-react';
import { SaleSession } from '../types';

interface Props {
  session: SaleSession;
  onUpdateQty: (itemId: string, qty: number) => void;
  onRemoveItem: (itemId: string) => void;
}

export function CartTable({ session, onUpdateQty, onRemoveItem }: Props) {
  return (
    <Paper radius={0} bg="#2f8a53" h="100%">
      <ScrollArea h="100%">
        <Table withTableBorder withColumnBorders stickyHeader>
          <Table.Thead bg="#f0d56a">
            <Table.Tr>
              <Table.Th>S/N</Table.Th>
              <Table.Th>CODE</Table.Th>
              <Table.Th>ITEM NAME</Table.Th>
              <Table.Th>PRICE</Table.Th>
              <Table.Th>UOM</Table.Th>
              <Table.Th>QTY</Table.Th>
              <Table.Th>TotalCost</Table.Th>
              <Table.Th></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {session.cart.map((item, index) => {
              const price =
                session.pricingMode === 'wholesale' ? item.wholesalePrice : item.retailPrice;
              return (
                <Table.Tr key={item.id} bg="#00185f">
                  <Table.Td c="lime">{index + 1}</Table.Td>
                  <Table.Td c="lime">{item.code}</Table.Td>
                  <Table.Td c="lime">{item.name}</Table.Td>
                  <Table.Td c="lime">{price.toFixed(2)}</Table.Td>
                  <Table.Td c="lime">{item.uomName}</Table.Td>
                  <Table.Td c="lime">
                    <NumberInput
                      size="xs"
                      min={1}
                      value={item.quantity}
                      onChange={(v) => onUpdateQty(item.id, Number(v) || 1)}
                      w={70}
                      styles={{
                        input: { color: 'lime', background: '#00185f', borderColor: '#2f8a53' },
                      }}
                    />
                  </Table.Td>
                  <Table.Td c="lime">
                    {(price * item.quantity * item.uomFactor).toFixed(2)}
                  </Table.Td>
                  <Table.Td>
                    <ActionIcon color="red" size="sm" onClick={() => onRemoveItem(item.id)}>
                      <Trash2 size={14} />
                    </ActionIcon>
                  </Table.Td>
                </Table.Tr>
              );
            })}
            {session.cart.length === 0 && (
              <Table.Tr>
                <Table.Td colSpan={8} ta="center" c="lime">
                  Cart is empty
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Paper>
  );
}
