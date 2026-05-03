import { createFileRoute } from '@tanstack/react-router'
import { GraphViewPage } from '@/features/communication/pages/graph-view'

export const Route = createFileRoute('/_authenticated/communication/flow-graph')({
  component: GraphViewPage,
})
