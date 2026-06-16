import { createFileRoute } from '@tanstack/react-router';
import { CodingConceptMatchPage } from '@/features/coding-concept/pages';

export const Route = createFileRoute('/_authenticated/coding-concept/match')({
  component: CodingConceptMatchPage,
});
