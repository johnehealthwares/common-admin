import { createFileRoute } from '@tanstack/react-router';
import { CodedFacilityWardsPage } from '@/features/coding-concept/pages';

export const Route = createFileRoute('/_authenticated/coding-concept/facilities/wards/')({
  component: CodedFacilityWardsPage,
});
