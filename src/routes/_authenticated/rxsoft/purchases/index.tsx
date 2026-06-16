import { createFileRoute } from '@tanstack/react-router';
import { RxPurchasesPage } from '@/features/rxsoft/pages';

export const Route = createFileRoute('/_authenticated/rxsoft/purchases/')({
  component: RxPurchasesPage,
});
