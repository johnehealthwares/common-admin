import { createFileRoute } from '@tanstack/react-router'
import { TraceExplorerPage } from '@/features/communication/pages/trace-explorer'

export const Route = createFileRoute('/_authenticated/communication/trace-explorer')({
  component: TraceExplorerPage,
})
