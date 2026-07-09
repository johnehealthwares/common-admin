import { createFileRoute } from '@tanstack/react-router';
import { LisPatientsPage } from '@/features/lis/pages';

export const Route = createFileRoute('/_authenticated/lis/patients/')({
  component: LisPatientsPage,
});
