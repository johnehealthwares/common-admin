import { createFileRoute } from '@tanstack/react-router';
import { NotificationTemplatesPage } from '@/features/communication/components/notification-templates';

export const Route = createFileRoute('/_authenticated/notification-templates')({
  component: NotificationTemplatesPage,
});
