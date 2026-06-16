import { createFileRoute } from '@tanstack/react-router';
import { RxWorkflowEventsPage } from '@/features/rxsoft/pages';

export const Route = createFileRoute('/_authenticated/conversation/workflow-events/')({
  component: RxWorkflowEventsPage,
});
