import { createFileRoute } from '@tanstack/react-router';
import { CodedFacilityTypesPage } from '@/features/coding-concept/pages';

export const Route = createFileRoute('/_authenticated/coding-concept/facilities/types/')({
  component: CodedFacilityTypesPage,
});
