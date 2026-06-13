import { createFileRoute } from '@tanstack/react-router';
import SearchPage from '@/features/damorex/search/page';

export const Route = createFileRoute('/damorex/search')({
  component: SearchPage,
});
