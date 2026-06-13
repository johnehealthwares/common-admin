import { createFileRoute } from '@tanstack/react-router';
import DeliveryAreasPage from '@/features/damorex/delivery/page';

export const Route = createFileRoute('/damorex/delivery-areas')({
  component: DeliveryAreasPage,
});
