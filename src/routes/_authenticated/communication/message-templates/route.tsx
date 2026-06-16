import { createFileRoute } from '@tanstack/react-router';
import { MessageTemplatesPage } from '@/features/communication/components/message-templates';

export const Route = createFileRoute('/_authenticated/communication/message-templates')({
  component: MessageTemplatesPage,
});
