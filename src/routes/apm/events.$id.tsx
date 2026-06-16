import { createFileRoute } from '@tanstack/react-router';
import EventDetailPage from '@/features/apm/events/detail';

export const Route = createFileRoute('/apm/events/$id')({
  component: EventDetailPage,
});
