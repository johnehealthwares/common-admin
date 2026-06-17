import { createFileRoute } from '@tanstack/react-router';
import { LgasPage } from '@/features/apm/admin/LgasPage';

export const Route = createFileRoute('/apm/admin/lgas')({
  component: LgasPage,
});
