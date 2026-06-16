import { createFileRoute } from '@tanstack/react-router';
import { CodingConceptUploadPage } from '@/features/coding-concept/pages';

export const Route = createFileRoute('/_authenticated/coding-concept/upload')({
  component: CodingConceptUploadPage,
});
