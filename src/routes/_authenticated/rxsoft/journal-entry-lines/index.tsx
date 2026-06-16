import { createFileRoute } from '@tanstack/react-router';
import { RxJournalEntryLinesPage } from '@/features/rxsoft/pages';

export const Route = createFileRoute('/_authenticated/rxsoft/journal-entry-lines/')({
  component: RxJournalEntryLinesPage,
});
