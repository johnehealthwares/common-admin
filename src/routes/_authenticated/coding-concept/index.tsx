import { createFileRoute } from '@tanstack/react-router';
import { CodingConceptRegistryPage } from '@/features/coding-concept/pages';

export const Route = createFileRoute('/_authenticated/coding-concept/')({
  component: CodingConceptRegistryPage,
});
