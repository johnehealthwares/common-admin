import { createFileRoute } from '@tanstack/react-router';
import { RxUsersPage } from '@/features/rxsoft/pages';

export const Route = createFileRoute('/_authenticated/rxsoft/users/')({
  component: RxUsersPage,
});
