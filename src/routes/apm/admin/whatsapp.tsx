import { createFileRoute } from '@tanstack/react-router';
import { WhatsAppGroupsPage } from '@/features/apm/admin/WhatsAppGroupsPage';

export const Route = createFileRoute('/apm/admin/whatsapp')({
  component: WhatsAppGroupsPage,
});
