import { createFileRoute } from '@tanstack/react-router';
import { RxQuestionnairesPage } from '@/features/rxsoft/pages';

export const Route = createFileRoute('/_authenticated/conversation/questionnaires/')({
  component: RxQuestionnairesPage,
});
