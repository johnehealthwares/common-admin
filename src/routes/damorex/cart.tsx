import { createFileRoute } from '@tanstack/react-router';
import CartPage from '@/features/damorex/cart/page';

export const Route = createFileRoute('/damorex/cart')({
  component: CartPage,
});
