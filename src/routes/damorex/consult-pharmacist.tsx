import { createFileRoute } from '@tanstack/react-router';
import BookConsultationPage from '@/features/damorex/consultations/book';

export const Route = createFileRoute('/damorex/consult-pharmacist')({
  component: BookConsultationPage,
});
