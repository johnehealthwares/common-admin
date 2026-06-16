import { createFileRoute } from '@tanstack/react-router';
import { RxInventoryPage } from '@/features/rxsoft/pages';

export const Route = createFileRoute('/_authenticated/rxsoft/inventory/')({
  component: RxInventoryPage,
});
