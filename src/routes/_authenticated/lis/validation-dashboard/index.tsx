import { createFileRoute } from '@tanstack/react-router';
import { LisValidationDashboardPage } from '@/features/lis/pages';

export const Route = createFileRoute('/_authenticated/lis/validation-dashboard/')({
  component: LisValidationDashboardPage,
});
