import { createFileRoute } from '@tanstack/react-router';
import { LisTestSectionsPage } from '@/features/lis/pages';

export const Route = createFileRoute('/_authenticated/lis/test-sections/')({
  component: LisTestSectionsPage,
});
