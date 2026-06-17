import { createFileRoute } from '@tanstack/react-router';
import { VolunteersPage } from '@/features/apm/admin/VolunteersPage';

export const Route = createFileRoute('/apm/admin/volunteers')({
  component: VolunteersPage,
});
