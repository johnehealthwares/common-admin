import { ActionIcon, Button, Group, Select, Text } from '@mantine/core';
import { Plus, RefreshCcw, Settings } from 'lucide-react';
import { useState } from 'react';
import { useCustomers, usePriceLists } from '../../api/posApi';
import { SaleSession } from '../types';
import { CustomerQuickAddModal } from './CustomerQuickAddModal';

interface Props {
  session: SaleSession;
  onCustomerChange: (customerId: string, customerName: string) => void;
  onPriceListChange: (priceListId: string, priceListName: string) => void;
  onPricingModeChange: (mode: 'retail' | 'wholesale') => void;
  onReset: () => void;
  onSettings: () => void;
}

export function PosToolbar({
  session,
  onCustomerChange,
  onPriceListChange,
  onPricingModeChange,
  onReset,
  onSettings,
}: Props) {
  const [customerModal, setCustomerModal] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [priceListSearch, setPriceListSearch] = useState('');

  const { data: customers = [] } = useCustomers(customerSearch);
  const { data: priceLists = [] } = usePriceLists(priceListSearch);

  const customerData = (Array.isArray(customers) ? customers : []).map((c: any) => ({
    value: c.id,
    label: c.name,
  }));

  const priceListData = (Array.isArray(priceLists) ? priceLists : []).map((p: any) => ({
    value: p.id,
    label: p.name,
  }));

  return (
    <>
      <Group px="md" py="xs" bg="#bfe0ea" gap="sm">
        <Button
          size="xs"
          color={session.pricingMode === 'retail' ? 'blue' : 'gray'}
          variant={session.pricingMode === 'retail' ? 'filled' : 'outline'}
          onClick={() => onPricingModeChange('retail')}
        >
          Single Item Selection
        </Button>
        <Button
          size="xs"
          color={session.pricingMode === 'wholesale' ? 'blue' : 'gray'}
          variant={session.pricingMode === 'wholesale' ? 'filled' : 'outline'}
          onClick={() => onPricingModeChange('wholesale')}
        >
          Multiple Item Selection
        </Button>

        <Select
          size="xs"
          placeholder="Choose Customer"
          data={customerData}
          value={session.customerId || null}
          onChange={(value, option) => {
            if (value) onCustomerChange(value, option.label);
          }}
          onSearchChange={setCustomerSearch}
          searchable
          clearable
          w={220}
        />

        <Button size="xs" leftSection={<Plus size={14} />} onClick={() => setCustomerModal(true)}>
          + Customer
        </Button>

        <Text fw={700} size="sm">
          Customer: {session.customerName || 'Walk-in'}
        </Text>

        <Select
          size="xs"
          placeholder="Price List"
          data={priceListData}
          value={session.priceListId || null}
          onChange={(value, option) => {
            if (value) onPriceListChange(value, option.label);
          }}
          onSearchChange={setPriceListSearch}
          searchable
          clearable
          w={200}
        />

        <Button size="xs" color="red" leftSection={<RefreshCcw size={14} />} onClick={onReset}>
          Reset POS
        </Button>

        <ActionIcon size="lg" variant="light" onClick={onSettings}>
          <Settings size={18} />
        </ActionIcon>
      </Group>

      <CustomerQuickAddModal
        opened={customerModal}
        onClose={() => setCustomerModal(false)}
        onCustomerCreated={(c) => {
          onCustomerChange(c.id, c.name);
          setCustomerModal(false);
        }}
      />
    </>
  );
}
