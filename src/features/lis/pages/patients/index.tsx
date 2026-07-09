import { DataPageShell } from '@/features/components/page/data-page-shell';
import { patientsConfig } from './schema';

export function LisPatientsPage() {
  return <DataPageShell config={patientsConfig} />;
}
