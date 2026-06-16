import { createFileRoute } from '@tanstack/react-router';
import { RxWebsiteOrdersPage } from '@/features/rxsoft/pages';

export const Route = createFileRoute('/_authenticated/rxsoft/website-orders/')({
  component: RxWebsiteOrdersPage,
});
