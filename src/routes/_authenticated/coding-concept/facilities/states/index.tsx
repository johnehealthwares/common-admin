import { createFileRoute } from '@tanstack/react-router';
import { CodedFacilityStatesPage } from '@/features/coding-concept/pages';

export const Route = createFileRoute('/_authenticated/coding-concept/facilities/states/')({
  component: CodedFacilityStatesPage,
});
