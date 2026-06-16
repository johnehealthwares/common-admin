import { createFileRoute } from '@tanstack/react-router';
import { CodingConceptSearchPage } from '@/features/coding-concept/pages';

export const Route = createFileRoute('/_authenticated/coding-concept/search')({
  component: CodingConceptSearchPage,
});
