import { createFileRoute } from '@tanstack/react-router';
import ForgotPasswordPage from '@/features/damorex/auth/forgot-password';

export const Route = createFileRoute('/damorex/forgot-password')({
  component: ForgotPasswordPage,
});
