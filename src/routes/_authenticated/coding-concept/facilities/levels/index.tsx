import { createFileRoute } from '@tanstack/react-router';
import { CodedFacilityLevelsPage } from '@/features/coding-concept/pages';

export const Route = createFileRoute('/_authenticated/coding-concept/facilities/levels/')({
  component: CodedFacilityLevelsPage,
});
