import { createFileRoute } from '@tanstack/react-router';
import { LisLocationTypesPage } from '@/features/lis/pages';

export const Route = createFileRoute('/_authenticated/lis/location-types/')({
  component: LisLocationTypesPage,
});
