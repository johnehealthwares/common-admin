import { createFileRoute } from '@tanstack/react-router';
import { WardsPage } from '@/features/apm/admin/WardsPage';

export const Route = createFileRoute('/apm/admin/wards/$lgaId')({
  component: WardsPage,
});
