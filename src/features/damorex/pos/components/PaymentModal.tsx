import { Button, Group, Modal, NumberInput, Select, Stack, Text } from '@mantine/core';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { rxsoftApi } from '@/lib/rxsoft-api';
import { useCreateSale, usePaymentMethods } from '../../api/posApi';

interface Props {
  opened: boolean;
  onClose: () => void;
  totals: { total: number };
  session: any;
  onComplete: () => void;
}

export function PaymentModal({ opened, onClose, totals, session, onComplete }: Props) {
  const [paid, setPaid] = useState(totals.total);
  const [methodId, setMethodId] = useState<string | null>(null);

  const { data: paymentMethods = [] } = usePaymentMethods();
  const { data: posConfig } = useQuery({
    queryKey: ['user-pos-config', 'me'],
    queryFn: async () => {
      const { data } = await rxsoftApi.get('/user-pos-config/me');
      return data;
    },
    staleTime: 60_000,
  });

  const mutation = useCreateSale({
    onSuccess: () => {
      onComplete();
      onClose();
    },
  });

  const methodOptions = (Array.isArray(paymentMethods) ? paymentMethods : []).map((pm: any) => ({
    value: pm.id,
    label: pm.name,
  }));

  const balance = totals.total - paid;
  const change = paid > totals.total ? paid - totals.total : 0;

  function handleComplete() {
    const lines = (session.cart || []).map((item: any) => ({
      itemId: item.id,
      uomId: item.uomId || '',
      quantity: item.quantity,
      unitPrice: session.pricingMode === 'wholesale' ? item.wholesalePrice : item.retailPrice,
    }));

    const payload: any = {
      saleNumber: session.saleCode,
      saleChannel: 'pos',
      storeId: posConfig?.storeId ?? 'default',
      customerId: session.customerId || null,
      stockLocationId: posConfig?.stockLocationId ?? null,
      lines,
      payments: methodId ? [{ paymentMethodId: methodId, amount: paid }] : [],
    };

    mutation.mutate(payload);
  }

  return (
    <Modal opened={opened} onClose={onClose} title="Payment" centered>
      <Stack>
        <Select
          label="Payment Method"
          value={methodId}
          onChange={(v) => setMethodId(v || null)}
          data={methodOptions}
          placeholder="Select method"
          clearable
        />

        <NumberInput
          label="Amount Paid"
          value={paid}
          onChange={(v) => setPaid(Number(v) || 0)}
          min={0}
        />

        <Text>Total: ₦{totals.total.toFixed(2)}</Text>
        <Text>Balance: ₦{Math.max(0, balance).toFixed(2)}</Text>
        {change > 0 && <Text c="green">Change: ₦{change.toFixed(2)}</Text>}

        <Group grow>
          <Button loading={mutation.isPending} onClick={handleComplete} disabled={!methodId}>
            Complete Sale
          </Button>
          <Button variant="light" onClick={onClose}>
            Cancel
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
