import { createFileRoute } from '@tanstack/react-router';
import VolunteerPage from '@/features/apm/volunteer/page';

export const Route = createFileRoute('/apm/volunteer')({
  component: VolunteerPage,
});
