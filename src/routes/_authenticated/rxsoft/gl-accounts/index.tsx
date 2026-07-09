import { createFileRoute } from '@tanstack/react-router';
import { RxGlAccountsPage } from '@/features/rxsoft/pages';

export const Route = createFileRoute('/_authenticated/rxsoft/gl-accounts/')({
  component: RxGlAccountsPage,
});
