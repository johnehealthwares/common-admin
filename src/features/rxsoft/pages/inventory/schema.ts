import type { Column } from '@/features/rxsoft/types';
import type { ModelConfig } from '@/features/shared/model-schema';

const stockBalancesColumns: Column[] = [
  { key: 'id', label: 'ID' },
  { key: 'productId', label: 'Product' },
  { key: 'locationId', label: 'Location' },
  { key: 'quantityOnHand', label: 'On Hand' },
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
