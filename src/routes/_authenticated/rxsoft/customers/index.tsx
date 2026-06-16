import { createFileRoute } from '@tanstack/react-router';
import { RxCustomersPage } from '@/features/rxsoft/pages';

export const Route = createFileRoute('/_authenticated/rxsoft/customers/')({
  component: RxCustomersPage,
});
