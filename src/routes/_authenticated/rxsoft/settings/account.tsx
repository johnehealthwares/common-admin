import { createFileRoute } from '@tanstack/react-router';
import { SettingsAccount } from '@/features/settings/account';

export const Route = createFileRoute('/_authenticated/rxsoft/settings/account')({
  component: SettingsAccount,
});
