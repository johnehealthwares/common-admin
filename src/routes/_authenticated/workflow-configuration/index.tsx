import { createFileRoute } from '@tanstack/react-router'
import { RxWorkflowConfigurationPage } from '@/features/rxsoft/pages'

export const Route = createFileRoute('/_authenticated/workflow-configuration/')({
  component: RxWorkflowConfigurationPage,
})
