import { createFileRoute } from '@tanstack/react-router';
import { RxWorkflowInstancesPage } from '@/features/rxsoft/pages';

export const Route = createFileRoute('/_authenticated/workflow-instances/')({
  component: RxWorkflowInstancesPage,
});
