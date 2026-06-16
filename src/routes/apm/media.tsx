import { createFileRoute } from '@tanstack/react-router';
import MediaPage from '@/features/apm/media/page';

export const Route = createFileRoute('/apm/media')({
  component: MediaPage,
});
