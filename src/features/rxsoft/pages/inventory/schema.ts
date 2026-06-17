import type { Column } from '@/features/rxsoft/types';
import type { ModelConfig } from '@/features/shared/model-schema';

const stockBalancesColumns: Column[] = [
  {
    key: 'item',
    label: 'Item',
    render: (row) => (row as any).item?.name ?? (row as any).itemId ?? '-',
  },
  {
    key: 'location',
    label: 'Location',
    render: (row) => (row as any).location?.name ?? (row as any).locationId ?? '-',
  },
  { key: 'quantityOnHand', label: 'On Hand' },
  { key: 'quantityReserved', label: 'Reserved' },
  {
    key: 'available',
    label: 'Available',
    render: (row) => {
      const available = Number((row as any).quantityOnHand ?? 0) - Number((row as any).quantityReserved ?? 0);
      return String(available);
    },
  },
];

const stockMovementsColumns: Column[] = [
  { key: 'id', label: 'ID' },
  { key: 'stockBalanceId', label: 'Stock Balance' },
  { key: 'movementType', label: 'Type' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'createdAt', label: 'Created' },
];

export const stockBalancesConfig: ModelConfig = {
  id: 'stock-balances',
  title: 'Stock Balances',
  description: 'Inventory stock balances with pagination and filters.',
  endpoint: '/inventory/stock-balances',
  columns: stockBalancesColumns,
};

export const stockMovementsConfig: ModelConfig = {
  id: 'stock-movements',
  title: 'Stock Movements',
  description: 'Inventory movement log.',
  endpoint: '/inventory/stock-movements',
  columns: stockMovementsColumns,
};
