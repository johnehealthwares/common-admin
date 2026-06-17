import { createFileRoute } from '@tanstack/react-router';
import { RxWarehousesPage } from '@/features/rxsoft/pages/warehouses';

export const Route = createFileRoute('/_authenticated/rxsoft/warehouses/')({
  component: RxWarehousesPage,
});
