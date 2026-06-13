import { createFileRoute } from '@tanstack/react-router';
import ConsultationsPage from '@/features/damorex/consultations/list';

export const Route = createFileRoute('/damorex/consultations')({
  component: ConsultationsPage,
});
