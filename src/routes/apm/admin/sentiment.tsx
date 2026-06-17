import { createFileRoute } from '@tanstack/react-router';
import { SentimentPage } from '@/features/apm/admin/SentimentPage';

export const Route = createFileRoute('/apm/admin/sentiment')({
  component: SentimentPage,
});
