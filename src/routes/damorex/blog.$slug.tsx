import { createFileRoute } from '@tanstack/react-router';
import ArticlePage from '@/features/damorex/blog/article';

export const Route = createFileRoute('/damorex/blog/$slug')({
  component: ArticlePage,
});
