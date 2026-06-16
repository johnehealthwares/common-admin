import { Button, Flex, Paper, Stack, Text, Title } from '@mantine/core';
import { Calculator } from 'lucide-react';

interface Props {
  itemCount: number;
  totals: { subtotal: number; discount: number; vat: number; total: number };
  onCheckout: () => void;
  onHold: () => void;
  onNextCustomer: () => void;
  onSellPrint: () => void;
  onPrintWholesale: () => void;
  paidAmount: number;
}

export function SalesSummary({
  itemCount,
  totals,
  onCheckout,
  onHold,
  onNextCustomer,
  onSellPrint,
  onPrintWholesale,
  paidAmount,
}: Props) {
  return (
    <Paper radius={0} withBorder bg="#c7e6f1" h="100%" p="md">
      <Stack>
        <Title order={3} ta="center">
          Current Sales Summary
        </Title>

        <Paper withBorder p="xs" radius={0}>
          <Flex justify="space-between">
            <Text size="sm">Items on Cart</Text>
            <Text fw={700}>{itemCount}</Text>
          </Flex>
        </Paper>

        <Paper withBorder p="xs" radius={0}>
          <Flex justify="space-between">
            <Text size="sm">Total Cost</Text>
            <Text fw={700}>₦{totals.total.toFixed(2)}</Text>
          </Flex>
        </Paper>

        <Paper withBorder p="xs" radius={0}>
          <Flex justify="space-between">
            <Text size="sm">Total Paid</Text>
            <Text fw={700}>{paidAmount > 0 ? `₦${paidAmount.toFixed(2)}` : 'Not Yet Paid'}</Text>
          </Flex>
        </Paper>

        <Button fullWidth mt="md" leftSection={<Calculator size={16} />} onClick={onCheckout}>
          Calculate Current Sales
        </Button>

        <Paper mt="md" p="md" withBorder>
          <Text ta="center" fw={700}>
            Total Cost
          </Text>
          <Title order={2} ta="center">
            ₦{totals.total.toFixed(2)}
          </Title>
        </Paper>

        <Button fullWidth mt="md" onClick={onCheckout}>
          Sell Only
        </Button>
        <Button fullWidth mt="xs" onClick={onSellPrint}>
          Sell Print
        </Button>
        <Button fullWidth mt="xs" onClick={onPrintWholesale}>
          Print Wholesale Receipt
        </Button>
        <Button fullWidth mt="xs" variant="light" onClick={onHold}>
          Hold Sale
        </Button>
        <Button fullWidth mt="xs" variant="outline" onClick={onNextCustomer}>
          Next Customer
        </Button>
      </Stack>
    </Paper>
  );
}
