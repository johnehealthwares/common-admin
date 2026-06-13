import { createFileRoute } from '@tanstack/react-router';
import PrivacyPage from '@/features/damorex/pages/privacy';

export const Route = createFileRoute('/damorex/privacy-policy')({
  component: PrivacyPage,
});
