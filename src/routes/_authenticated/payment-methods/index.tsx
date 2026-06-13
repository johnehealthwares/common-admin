import { createFileRoute } from '@tanstack/react-router';
import { RxPaymentMethodsPage } from '@/features/rxsoft/pages';

export const Route = createFileRoute('/_authenticated/payment-methods/')({
  component: RxPaymentMethodsPage,
});
