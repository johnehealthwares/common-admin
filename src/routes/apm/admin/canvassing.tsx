import { createFileRoute } from '@tanstack/react-router';
import { CanvassingPage } from '@/features/apm/admin/CanvassingPage';

export const Route = createFileRoute('/apm/admin/canvassing')({
  component: CanvassingPage,
});
