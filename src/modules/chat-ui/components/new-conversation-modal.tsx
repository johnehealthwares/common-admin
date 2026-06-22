import { ActionIcon, Button, Group, Input, Modal, Stack, Text } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { Loader2, MessagesSquare, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { AsyncSelectField } from '@/features/components/form/async-field';
import {
  addProjection,
  createConversation,
  createParticipant,
  findParticipantByPhone,
} from '../services/chat-api';
import type { Option } from '@/features/rxsoft/types';

type Props = {
  opened: boolean;
  onClose: () => void;
  onCreated: (conversationId: string) => void;
};

export function NewConversationModal({ opened, onClose, onCreated }: Props) {
  const [phones, setPhones] = useState<string[]>(['']);
  const [questionnaire, setQuestionnaire] = useState<Option | null>(null);
  const [channel, setChannel] = useState<Option | null>(null);

  const createMutation = useMutation({
    mutationFn: async () => {
      const firstPhone = phones[0]?.trim();
      const data = await createConversation({
        phone: firstPhone || undefined,
        questionnaireId: questionnaire?.value || '',
        channelId: channel?.value || '',
      });
      const conversationId = data?.id || data?.conversationId || '';
      const channelId = channel?.value || '';
      const remainingPhones = phones.slice(1).map((p) => p.trim()).filter(Boolean);
      for (const phone of remainingPhones) {
        let participant = await findParticipantByPhone(phone);
        if (!participant?.id) {
          participant = await createParticipant({ phone });
        }
        await addProjection({
          conversationId,
          participantId: participant.id,
          channelId,
          role: 'USER' as any,
        });
      }
      return { conversationId };
    },
    onSuccess: ({ conversationId }) => {
      setPhones(['']);
      setQuestionnaire(null);
      setChannel(null);
      onCreated(conversationId);
      onClose();
    },
  });

  const canSubmit = phones.some((p) => p.trim()) && questionnaire && channel;

  function addPhone() {
    setPhones((prev) => [...prev, '']);
  }

  function removePhone(index: number) {
    setPhones((prev) => prev.filter((_, i) => i !== index));
  }

  function updatePhone(index: number, value: string) {
    setPhones((prev) => prev.map((p, i) => (i === index ? value : p)));
  }

  return (
    <Modal opened={opened} onClose={onClose} title="New Conversation" size="lg">
      <Stack gap="md">
        <Text size="sm" fw={500}>Participants</Text>
        {phones.map((phone, index) => (
          <Group key={index} gap="xs">
            <Input
              value={phone}
              onChange={(e) => updatePhone(index, e.target.value)}
              placeholder={`Participant phone ${index + 1}`}
              style={{ flex: 1 }}
            />
            {phones.length > 1 && (
              <ActionIcon color="red" variant="light" onClick={() => removePhone(index)}>
                <Trash2 size={16} />
              </ActionIcon>
            )}
          </Group>
        ))}
        <Button variant="subtle" size="sm" onClick={addPhone} leftSection={<Plus size={16} />}>
          Add participant
        </Button>

        <AsyncSelectField
          value={questionnaire}
          field={{
            name: 'questionnaireId',
            label: 'Questionnaire',
            type: 'async-select',
            searchParam: {
              endpoint: '/questionnaires',
              queryParam: 'search',
              minChars: 2,
              valueKey: 'id',
              labelKey: 'name',
            },
            placeholder: 'Search questionnaire',
          }}
          onChange={setQuestionnaire}
        />
        <AsyncSelectField
          value={channel}
          field={{
            name: 'channelId',
            label: 'Channel',
            type: 'async-select',
            searchParam: {
              endpoint: '/channels',
              queryParam: 'search',
              minChars: 0,
              valueKey: 'id',
              labelKey: 'name',
            },
            placeholder: 'Search channel',
          }}
          onChange={setChannel}
        />
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={!canSubmit || createMutation.isPending}
            onClick={() => createMutation.mutate()}
          >
            {createMutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <MessagesSquare className="size-4" />
            )}
            Start Conversation
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
