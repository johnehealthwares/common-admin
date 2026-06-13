import { createFileRoute } from '@tanstack/react-router';
import { RxOrganizationsPage } from '@/features/rxsoft/pages';

export const Route = createFileRoute('/_authenticated/organizations/')({
  component: RxOrganizationsPage,
});
