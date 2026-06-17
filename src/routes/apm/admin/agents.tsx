import { createFileRoute } from '@tanstack/react-router';
import { AgentsPage } from '@/features/apm/admin/AgentsPage';

export const Route = createFileRoute('/apm/admin/agents')({
  component: AgentsPage,
});
