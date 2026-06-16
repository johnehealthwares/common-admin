import { createFileRoute } from '@tanstack/react-router';
import { CodedPharmaceuticsPage } from '@/features/coding-concept/pages';

export const Route = createFileRoute('/_authenticated/coding-concept/pharmaceutics/')({
  component: CodedPharmaceuticsPage,
});
