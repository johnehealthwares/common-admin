import { createFileRoute } from '@tanstack/react-router'
import { RxUomEditPage } from '@/features/rxsoft/pages'

export const Route = createFileRoute('/_authenticated/uoms/$uomId/edit')({
  component: UomEditRoute,
})

function UomEditRoute() {
  const { uomId } = Route.useParams()
  return <RxUomEditPage uomId={uomId} />
}
