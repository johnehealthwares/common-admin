import { createFileRoute } from '@tanstack/react-router';
import NewsPage from '@/features/apm/news/page';

export const Route = createFileRoute('/apm/news')({
  component: NewsPage,
});
