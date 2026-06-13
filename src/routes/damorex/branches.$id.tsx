import { createFileRoute } from '@tanstack/react-router';
import BranchDetailPage from '@/features/damorex/branches/detail';

export const Route = createFileRoute('/damorex/branches/$id')({
  component: BranchDetailPage,
});
