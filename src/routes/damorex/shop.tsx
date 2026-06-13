import { createFileRoute } from '@tanstack/react-router';
import ShopPage from '@/features/damorex/shop/page';

export const Route = createFileRoute('/damorex/shop')({
  component: ShopPage,
});
