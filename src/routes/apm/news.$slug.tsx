import { createFileRoute } from '@tanstack/react-router';
import NewsArticlePage from '@/features/apm/news/article';

export const Route = createFileRoute('/apm/news/$slug')({
  component: NewsArticlePage,
});
