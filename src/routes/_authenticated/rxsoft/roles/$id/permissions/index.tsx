import { createFileRoute } from '@tanstack/react-router';
import { RolePermissionsPage } from '@/features/rxsoft/pages/roles/permissions';

export const Route = createFileRoute('/_authenticated/rxsoft/roles/$id/permissions/')({
  component: RolePermissionsPage,
});
