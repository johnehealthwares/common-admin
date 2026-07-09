import { createFileRoute } from '@tanstack/react-router';
import { LisSamplesPage } from '@/features/lis/pages';

export const Route = createFileRoute('/_authenticated/lis/samples/')({
  component: LisSamplesPage,
});
