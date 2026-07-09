import { createFileRoute } from '@tanstack/react-router';
import { LisSampleTypesPage } from '@/features/lis/pages';

export const Route = createFileRoute('/_authenticated/lis/sample-types/')({
  component: LisSampleTypesPage,
});
