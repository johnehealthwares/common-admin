import { Button, Drawer, Stack, Text } from '@mantine/core';
import { useMemo } from 'react';
import { usePosStore } from '../store/usePosStore';

interface Props {
  opened: boolean;
  onClose: () => void;
  onResume: (sessionId: string) => void;
}

export function HeldSalesDrawer({ opened, onClose, onResume }: Props) {
  const sessions = usePosStore((state) => state.sessions);
  const heldSales = useMemo(() => sessions.filter((s) => s.held), [sessions]);

  return (
    <Drawer opened={opened} onClose={onClose} title="Held Sales" position="right">
      <Stack>
        {heldSales.map((sale) => (
          <Button
            key={sale.id}
            variant="light"
            onClick={() => {
              onResume(sale.id);
              onClose();
            }}
          >
            {sale.saleCode} - {sale.customerName || 'Walk-in'} ($
            {sale.cart.reduce((s, i) => s + i.lineTotal, 0).toFixed(2)})
          </Button>
        ))}
        {!heldSales.length && <Text>No held sales</Text>}
      </Stack>
    </Drawer>
  );
}
