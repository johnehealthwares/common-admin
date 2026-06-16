import { createFileRoute } from '@tanstack/react-router';
import { CodedFacilitiesPage } from '@/features/coding-concept/pages';

export const Route = createFileRoute('/_authenticated/coding-concept/facilities/')({
  component: CodedFacilitiesPage,
});
