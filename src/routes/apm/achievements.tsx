import { createFileRoute } from '@tanstack/react-router';
import AchievementsPage from '@/features/apm/achievements/page';

export const Route = createFileRoute('/apm/achievements')({
  component: AchievementsPage,
});
