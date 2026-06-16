import { createFileRoute } from '@tanstack/react-router';
import { RxWorkflowConfigurationPage } from '@/features/rxsoft/pages';

export const Route = createFileRoute('/_authenticated/conversation/workflow-configuration/')({
  component: RxWorkflowConfigurationPage,
});
