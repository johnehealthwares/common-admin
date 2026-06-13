import { createFileRoute } from '@tanstack/react-router';
import { RxJournalsPage } from '@/features/rxsoft/pages';

export const Route = createFileRoute('/_authenticated/journals/')({
  component: RxJournalsPage,
});
