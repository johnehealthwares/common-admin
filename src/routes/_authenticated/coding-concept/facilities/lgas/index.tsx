import { createFileRoute } from '@tanstack/react-router';
import { CodedFacilityLgasPage } from '@/features/coding-concept/pages';

export const Route = createFileRoute('/_authenticated/coding-concept/facilities/lgas/')({
  component: CodedFacilityLgasPage,
});
