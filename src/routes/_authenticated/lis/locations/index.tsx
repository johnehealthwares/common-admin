import { createFileRoute } from '@tanstack/react-router';
import { LisLocationsPage } from '@/features/lis/pages';

export const Route = createFileRoute('/_authenticated/lis/locations/')({
  component: LisLocationsPage,
});
