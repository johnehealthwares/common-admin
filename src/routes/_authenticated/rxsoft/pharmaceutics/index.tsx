import { createFileRoute } from '@tanstack/react-router';
import { RxPharmaceuticsPage } from '@/features/rxsoft/pages';

export const Route = createFileRoute('/_authenticated/rxsoft/pharmaceutics/')({
  component: RxPharmaceuticsPage,
});
