import { createFileRoute } from '@tanstack/react-router';
import { ApplicationEntitiesPage } from '@/features/communication/components/ae';
import { MessagesPage } from '@/features/communication/components/messages';

export const Route = createFileRoute('/_authenticated/communication/aes')({
  component: ApplicationEntitiesPage,
});
