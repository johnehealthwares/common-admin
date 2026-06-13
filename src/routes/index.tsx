import { createFileRoute } from '@tanstack/react-router';
import DamorexPage from '@/features/damorex/page';

export const Route = createFileRoute('/')({
  component: DamorexPage,
});
