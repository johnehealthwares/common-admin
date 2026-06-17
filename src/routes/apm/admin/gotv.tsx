import { createFileRoute } from '@tanstack/react-router';
import { GotvPage } from '@/features/apm/admin/GotvPage';

export const Route = createFileRoute('/apm/admin/gotv')({
  component: GotvPage,
});
