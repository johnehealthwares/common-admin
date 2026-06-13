import { createFileRoute } from '@tanstack/react-router';
import AboutPage from '@/features/damorex/pages/about';

export const Route = createFileRoute('/damorex/about')({
  component: AboutPage,
});
