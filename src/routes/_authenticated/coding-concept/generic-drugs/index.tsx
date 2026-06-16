import { createFileRoute } from '@tanstack/react-router';
import { CodedGenericDrugsPage } from '@/features/coding-concept/pages';

export const Route = createFileRoute('/_authenticated/coding-concept/generic-drugs/')({
  component: CodedGenericDrugsPage,
});
