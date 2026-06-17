import { createFileRoute } from '@tanstack/react-router';
import { ListeningPage } from '@/features/apm/admin/ListeningPage';

export const Route = createFileRoute('/apm/admin/listening')({
  component: ListeningPage,
});
