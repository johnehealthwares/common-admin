import { createFileRoute } from '@tanstack/react-router';
import { RxChannelsPage } from '@/features/rxsoft/pages';

export const Route = createFileRoute('/_authenticated/channels/')({
  component: RxChannelsPage,
});
