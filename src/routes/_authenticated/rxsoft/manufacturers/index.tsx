import { createFileRoute } from '@tanstack/react-router';
import { RxManufacturersPage } from '@/features/rxsoft/pages';

export const Route = createFileRoute('/_authenticated/rxsoft/manufacturers/')({
  component: RxManufacturersPage,
});
