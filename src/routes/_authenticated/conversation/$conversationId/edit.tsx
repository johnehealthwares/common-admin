import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { RxPage } from '@/features/components/page/rx-page';
import { GenericViewComponent } from '@/features/components/view';
import {
  conversationPageSchema,
  questionPageSchema,
} from '@/features/rxsoft/pages/conversation/components/conversation-page-schemas';
import type { View } from '@/features/rxsoft/types';
import { conversationApi } from '@/lib/conversation-api';

export const Route = createFileRoute('/_authenticated/conversation/$conversationId/edit')({
  component: ConversationEditPage,
});

function ConversationEditPage() {
  const { conversationId } = Route.useParams();
  const navigate = useNavigate();

  const detailQuery = useQuery({
    queryKey: ['conversations', conversationId],
    queryFn: async () => {
      const response = await conversationApi.get(`/conversations/${conversationId}`);
      return response.data as Record<string, unknown>;
    },
  });

  const data = detailQuery.data?.data ?? detailQuery.data;

  const view: View<any> = {
    endpoint: '/conversations/:id',
    fieldGroups: [
      {
        title: 'Conversation Details',
        fields: [
          {
            key: 'questionnaire',
            label: 'Questionnaire',
            render: (v: any) => v?.name ?? '-',
          },
          {
            key: 'channel',
            label: 'Channel',
            render: (v: any) => v?.name ?? '-',
          },
          { key: 'status', label: 'Status' },
          { key: 'state', label: 'State' },
          { key: 'participantId', label: 'Participant ID' },
          {
            key: 'currentQuestion',
            label: 'Current Question',
            render: (v: any) => v?.text ?? '-',
          },
        ],
      },
    ],
    accordions: [
      {
        key: 'questions',
        title: 'Questions',
        labelKey: 'text',
        itemEditConfig: questionPageSchema,
      },
    ],
  };

  if (detailQuery.isLoading) {
    return (
      <RxPage
        title={conversationPageSchema.title}
        description={conversationPageSchema.description}
        breadcrumbs={[
          { label: 'Conversations', href: '/conversation' },
          { label: conversationId },
        ]}
        onBack={() => navigate({ to: '/conversation' })}
      >
        <div>Loading...</div>
      </RxPage>
    );
  }

  return (
    <RxPage
      title={conversationPageSchema.title}
      description={conversationPageSchema.description}
      breadcrumbs={[
        { label: 'Conversations', href: '/conversation' },
        { label: conversationId },
      ]}
      onBack={() => navigate({ to: '/conversation' })}
    >
      <GenericViewComponent view={view} data={data} />
    </RxPage>
  );
}
