import { createFileRoute } from '@tanstack/react-router';
import { RxInventoryPage } from '@/features/rxsoft/pages';

export const Route = createFileRoute('/_authenticated/inventory/')({
  component: RxInventoryPage,
});
