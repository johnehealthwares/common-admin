import { createFileRoute } from '@tanstack/react-router';
import { RxPurchasesPage } from '@/features/rxsoft/pages';

export const Route = createFileRoute('/_authenticated/purchases/')({
  component: RxPurchasesPage,
});
