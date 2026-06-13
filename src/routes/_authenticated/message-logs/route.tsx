import { createFileRoute } from '@tanstack/react-router';
import { MessageLogsPage } from '@/features/communication/components/message-logs';

export const Route = createFileRoute('/_authenticated/message-logs')({
  component: MessageLogsPage,
});
