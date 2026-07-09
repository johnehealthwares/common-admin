import { createFileRoute } from '@tanstack/react-router';
import { LisLoincPage } from '@/features/lis/pages';

export const Route = createFileRoute('/_authenticated/lis/loinc/')({
  component: LisLoincPage,
});
