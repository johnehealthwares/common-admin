import { createFileRoute } from '@tanstack/react-router';
import ProductDetailPage from '@/features/damorex/shop/product';

export const Route = createFileRoute('/damorex/shop_/$slug')({
  component: ProductDetailPage,
});
