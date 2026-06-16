import { createFileRoute } from '@tanstack/react-router';
import AgendaPage from '@/features/apm/agenda/page';

export const Route = createFileRoute('/apm/agenda')({
  component: AgendaPage,
});
