import { createFileRoute } from '@tanstack/react-router';
import { RxJournalEntriesPage } from '@/features/rxsoft/pages';

export const Route = createFileRoute('/_authenticated/rxsoft/journal-entries/')({
  component: RxJournalEntriesPage,
});
