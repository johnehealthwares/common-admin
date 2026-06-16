import { createFileRoute } from '@tanstack/react-router';
import { RxPaymentMethodsPage } from '@/features/rxsoft/pages';

export const Route = createFileRoute('/_authenticated/rxsoft/payment-methods/')({
  component: RxPaymentMethodsPage,
});
