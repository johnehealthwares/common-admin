import { createFileRoute } from '@tanstack/react-router';
import { MappingPage } from '@/features/communication/components/mapping';

export const Route = createFileRoute('/_authenticated/mapping')({
  component: MappingPage,
});
