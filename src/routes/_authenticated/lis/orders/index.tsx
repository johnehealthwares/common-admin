import { createFileRoute } from '@tanstack/react-router';
import { LisOrdersPage } from '@/features/lis/pages';

export const Route = createFileRoute('/_authenticated/lis/orders/')({
  component: LisOrdersPage,
});
