import { createFileRoute } from '@tanstack/react-router';
import { ConversionDashboard } from '@/features/apm/admin/ConversionDashboard';

export const Route = createFileRoute('/apm/admin/conversion')({
  component: ConversionDashboard,
});
