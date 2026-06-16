import { createFileRoute } from '@tanstack/react-router';
import { RxReceivingPage } from '@/features/rxsoft/pages';

export const Route = createFileRoute('/_authenticated/rxsoft/receiving/')({
  component: RxReceivingPage,
});
