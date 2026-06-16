import { createFileRoute } from '@tanstack/react-router';
import { RxJournalsPage } from '@/features/rxsoft/pages';

export const Route = createFileRoute('/_authenticated/rxsoft/journals/')({
  component: RxJournalsPage,
});
