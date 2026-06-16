import { createFileRoute } from '@tanstack/react-router';
import EventsPage from '@/features/apm/events/page';

export const Route = createFileRoute('/apm/events')({
  component: EventsPage,
});
