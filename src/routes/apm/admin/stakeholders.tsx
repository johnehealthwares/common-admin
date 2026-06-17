import { createFileRoute } from '@tanstack/react-router';
import { StakeholdersPage } from '@/features/apm/admin/StakeholdersPage';

export const Route = createFileRoute('/apm/admin/stakeholders')({
  component: StakeholdersPage,
});
