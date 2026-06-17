import { createFileRoute } from '@tanstack/react-router';
import { PollingUnitsPage } from '@/features/apm/admin/PollingUnitsPage';

export const Route = createFileRoute('/apm/admin/polling-units/$wardId')({
  component: PollingUnitsPage,
});
