import { createFileRoute } from '@tanstack/react-router';
import ApmHomepage from '@/features/apm/page';

export const Route = createFileRoute('/apm/')({
  component: ApmHomepage,
});
