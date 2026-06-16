import { createFileRoute } from '@tanstack/react-router';
import { RoutingPage } from '@/features/communication/components/routing';

export const Route = createFileRoute('/_authenticated/communication/routing')({
  component: RoutingPage,
});
