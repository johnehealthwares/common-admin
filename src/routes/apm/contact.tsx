import { createFileRoute } from '@tanstack/react-router';
import ContactPage from '@/features/apm/contact/page';

export const Route = createFileRoute('/apm/contact')({
  component: ContactPage,
});
