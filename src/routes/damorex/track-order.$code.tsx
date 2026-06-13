import { createFileRoute } from '@tanstack/react-router';
import TrackOrderPage from '@/features/damorex/orders/track';

export const Route = createFileRoute('/damorex/track-order/$code')({
  component: TrackOrderPage,
});
