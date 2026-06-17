import { createFileRoute } from '@tanstack/react-router';
import { IncidentsPage } from '@/features/apm/admin/IncidentsPage';

export const Route = createFileRoute('/apm/admin/incidents')({
  component: IncidentsPage,
});
