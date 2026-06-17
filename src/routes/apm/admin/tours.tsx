import { createFileRoute } from '@tanstack/react-router';
import { ToursPage } from '@/features/apm/admin/ToursPage';

export const Route = createFileRoute('/apm/admin/tours')({
  component: ToursPage,
});
