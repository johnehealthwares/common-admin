import { createFileRoute } from '@tanstack/react-router';
import { LisTestDefinitionsPage } from '@/features/lis/pages';

export const Route = createFileRoute('/_authenticated/lis/test-definitions/')({
  component: LisTestDefinitionsPage,
});
