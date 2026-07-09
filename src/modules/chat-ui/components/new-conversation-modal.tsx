import { ActionIcon, Button, Group, Input, Modal, Paper, Select, Stack, Text } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { Loader2, MessagesSquare, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AsyncSelectField } from '@/features/components/form/async-field';
import {
  createConversation,
} from '../services/chat-api';
import { FilterType, type Option } from '@/features/rxsoft/types';

type ParticipantEntry = {
  participantId?: string;
  phone: string;
  channelId: string;
  channelLabel: string;
  role: string;
};

type Props = {
  opened: boolean;
  onClose: () => void;
  onCreated: (conversationId: string) => void;
  adminParticipantId?: string;
  adminPhone?: string;
};

export function NewConversationModal({ opened, onClose, onCreated, adminParticipantId, adminPhone }: Props) {
  const [entries, setEntries] = useState<ParticipantEntry[]>([]);
  const [questionnaire, setQuestionnaire] = useState<Option | null>(null);

  useEffect(() => {
    if (!opened) {return;}
    setEntries([
      { participantId: adminParticipantId, phone: adminPhone || '', channelId: '', channelLabel: '', role: 'AGENT' },
      { participantId: '', phone: '', channelId: '', channelLabel: '', role: 'USER' },
    ]);
    setQuestionnaire(null);
  }, [opened, adminParticipantId, adminPhone]);

  const createMutation = useMutation({
    mutationFn: async () => {
      const first = entries[0];
      const validEntries = entries.filter((e) => e.channelId && (e.participantId || e.phone.trim()));
      const data = await createConversation({
        channelId: first.channelId,
        questionnaireId: questionnaire?.value || '',
        projections: validEntries.map((e) => ({
          participantId: e.participantId || undefined,
          phone: e.participantId ? undefined : e.phone.trim() || undefined,
          channelId: e.channelId,
          role: e.role,
        })),
      });
      return { conversationId: data?.id || data?.conversationId || '' };
    },
    onSuccess: ({ conversationId }) => {
      setEntries([]);
      setQuestionnaire(null);
      onCreated(conversationId);
      onClose();
    },
  });

  const canSubmit = entries.length > 0 && entries[0].channelId && questionnaire;

  function updateEntry(index: number, patch: Partial<ParticipantEntry>) {
    setEntries((prev) => prev.map((e, i) => (i === index ? { ...e, ...patch } : e)));
  }

  function addEntry() {
    setEntries((prev) => [...prev, { participantId: '', phone: '', channelId: '', channelLabel: '', role: 'USER' }]);
  }

  function removeEntry(index: number) {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  }

  function onParticipantSelect(index: number, option: Option | null) {
    if (option) {
      updateEntry(index, { participantId: option.value, phone: option.label });
    } else {
      updateEntry(index, { participantId: undefined });
    }
  }

  return (
    <Modal opened={opened} onClose={onClose} title="New Conversation" size="lg">
      <Stack gap="md">
        <Text size="sm" fw={500}>Participants</Text>
        {entries.map((entry, index) => (
          <Paper key={index} withBorder p="sm" radius="md">
            <Stack gap="xs">
              <Group gap="xs" align="end">
                <AsyncSelectField
                  value={entry.participantId ? { value: entry.participantId, label: entry.phone } : null}
                  field={{
                    name: `participant-${index}`,
                    label: 'Participant',
                    type: 'async-select',
                    searchParam: {
                      endpoint: '/participants',
                      queryParam: 'search',
                      minChars: 3,
                      valueKey: 'id',
                      labelKey: 'phone',
                      staticFilters: [{ filter: { type: FilterType.EQUALS, name: 'attribute' }, value: 'phone' }],
                    },
                    placeholder: 'Search by phone',
                  }}
                  onChange={(option) => onParticipantSelect(index, option)}
                />
                {index > 0 && (
                  <ActionIcon color="red" variant="light" onClick={() => removeEntry(index)}>
                    <Trash2 size={16} />
                  </ActionIcon>
                )}
              </Group>
              {!entry.participantId && (
                <Input
                  value={entry.phone}
                  onChange={(e) => updateEntry(index, { phone: e.target.value })}
                  placeholder="Or enter new phone"
                />
              )}
              <AsyncSelectField
                value={entry.channelId ? { value: entry.channelId, label: entry.channelLabel } : null}
                field={{
                  name: `channel-${index}`,
                  label: 'Channel',
                  type: 'async-select',
                  searchParam: {
                    endpoint: '/channels',
                    queryParam: 'search',
                    minChars: 0,
                    valueKey: 'id',
                    labelKey: 'name',
                  },
                  placeholder: 'Select channel',
                }}
                onChange={(option) => updateEntry(index, { channelId: option?.value || '', channelLabel: option?.label || '' })}
              />
              <Select
                value={entry.role}
                onChange={(v) => updateEntry(index, { role: v || 'USER' })}
                data={[
                  { value: 'USER', label: 'User' },
                  { value: 'PATIENT', label: 'Patient' },
                  { value: 'DOCTOR', label: 'Doctor' },
                  { value: 'NURSE', label: 'Nurse' },
                  { value: 'AGENT', label: 'Agent' },
                ]}
                placeholder="Select role"
                clearable
              />
            </Stack>
          </Paper>
        ))}
        <Button variant="subtle" size="sm" onClick={addEntry} leftSection={<Plus size={16} />}>
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
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose}>Cancel</Button>
          <Button
            disabled={!canSubmit || createMutation.isPending}
            onClick={() => createMutation.mutate()}
          >
            {createMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <MessagesSquare className="size-4" />}
            Start Conversation
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
