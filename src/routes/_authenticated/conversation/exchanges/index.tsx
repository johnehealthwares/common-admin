import { createFileRoute } from '@tanstack/react-router';
import { RxExchangesPage } from '@/features/rxsoft/pages';

export const Route = createFileRoute('/_authenticated/conversation/exchanges/')({
  component: RxExchangesPage,
});
