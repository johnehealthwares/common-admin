import { DataPageShell } from '../../../components/page/data-page-shell';
import { journalEntriesConfig } from './schema';

export function RxJournalEntriesPage() {
  return <DataPageShell config={journalEntriesConfig} />;
}
