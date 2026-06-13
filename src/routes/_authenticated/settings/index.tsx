import { createFileRoute } from '@tanstack/react-router';
import { RxSettingsPage } from '@/features/rxsoft/pages';

export const Route = createFileRoute('/_authenticated/settings/')({
  component: RxSettingsPage,
});
