import { createFileRoute } from '@tanstack/react-router';
import JoinPage from '@/features/apm/join/page';

export const Route = createFileRoute('/apm/join')({
  component: JoinPage,
});
