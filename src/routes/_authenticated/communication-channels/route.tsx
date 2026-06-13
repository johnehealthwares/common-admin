import { createFileRoute } from '@tanstack/react-router';
import { CommunicationChannelsPage } from '@/features/communication/components/communication-channels';

export const Route = createFileRoute('/_authenticated/communication-channels')({
  component: CommunicationChannelsPage,
});
