import { createFileRoute } from '@tanstack/react-router';
import { RxUomDetailsPage } from '@/features/rxsoft/pages';

export const Route = createFileRoute('/_authenticated/uoms/$uomId')({
  component: UomDetailsRoute,
});

function UomDetailsRoute() {
  const { uomId } = Route.useParams();
  return <RxUomDetailsPage uomId={uomId} />;
}
