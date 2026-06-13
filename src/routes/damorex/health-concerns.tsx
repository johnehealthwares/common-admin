import { createFileRoute } from '@tanstack/react-router';
import HealthConcernsPage from '@/features/damorex/health-concerns/page';

export const Route = createFileRoute('/damorex/health-concerns')({
  component: HealthConcernsPage,
});
