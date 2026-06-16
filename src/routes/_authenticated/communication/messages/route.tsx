import { createFileRoute } from '@tanstack/react-router';
import { MessagesPage } from '@/features/communication/components/messages';

export const Route = createFileRoute('/_authenticated/communication/messages')({
  component: MessagesPage,
});
