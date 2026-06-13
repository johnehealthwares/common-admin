import { createFileRoute } from '@tanstack/react-router';
import { RxBranchesPage } from '@/features/rxsoft/pages';

export const Route = createFileRoute('/_authenticated/branches/')({
  component: RxBranchesPage,
});
