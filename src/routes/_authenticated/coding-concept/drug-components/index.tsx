import { createFileRoute } from '@tanstack/react-router';
import { CodedDrugComponentsPage } from '@/features/coding-concept/pages';

export const Route = createFileRoute('/_authenticated/coding-concept/drug-components/')({
  component: CodedDrugComponentsPage,
});
