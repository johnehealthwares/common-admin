import { createFileRoute } from '@tanstack/react-router';
import MeetAdekanmbiPage from '@/features/apm/meet/page';

export const Route = createFileRoute('/apm/meet')({
  component: MeetAdekanmbiPage,
});
