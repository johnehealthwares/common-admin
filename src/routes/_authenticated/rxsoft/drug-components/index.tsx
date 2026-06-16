import { createFileRoute } from '@tanstack/react-router';
import { RxDrugComponentsPage } from '@/features/rxsoft/pages';

export const Route = createFileRoute('/_authenticated/rxsoft/drug-components/')({
  component: RxDrugComponentsPage,
});
