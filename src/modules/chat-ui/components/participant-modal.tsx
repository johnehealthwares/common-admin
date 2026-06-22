import {
  ActionIcon,
  Alert,
  Button,
  Group,
  Input,
  Modal,
  Select,
  Stack,
  Table,
  Text,
} from '@mantine/core';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AlertCircle, Trash2, UserPlus, UserX } from 'lucide-react';
import { useState } from 'react';
import { AsyncSelectField } from '@/features/components/form/async-field';
import {
  addProjection,
  findParticipantByPhone,
  listProjections,
  removeParticipantProjections,
} from '../services/chat-api';
import type { ParticipantRole } from '../types';
import type { Option } from '@/features/rxsoft/types';

type Props = {
  opened: boolean;
  onClose: () => void;
  conversationId?: string;
  defaultMode?: 'add' | 'remove';
};

export function ParticipantModal({
  opened,
  onClose,
  conversationId,
  defaultMode = 'add',
}: Props) {
  const [mode, setMode] = useState<'add' | 'remove'>(defaultMode);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={mode === 'add' ? 'Add Participant' : 'Remove Participant'}
      size="lg"
    >
      {mode === 'add' ? (
        <AddParticipantForm conversationId={conversationId} onClose={onClose} />
      ) : (
        <RemoveParticipantForm conversationId={conversationId} onClose={onClose} />
      )}
    </Modal>
  );
}

function AddParticipantForm({
  conversationId,
  onClose,
}: {
  conversationId?: string;
  onClose: () => void;
}) {
  const [phone, setPhone] = useState('');
  const [channel, setChannel] = useState<Option | null>(null);
  const [role, setRole] = useState<ParticipantRole | null>('USER' as ParticipantRole);

  const addMutation = useMutation({
    mutationFn: async () => {
      const participant = await findParticipantByPhone(phone.trim());
      if (!participant?.id) throw new Error('Participant not found');
      return addProjection({
        conversationId: conversationId!,
        participantId: participant.id,
        channelId: channel?.value || '',
        role: role || ('USER' as ParticipantRole),
      });
    },
    onSuccess: () => {
      setPhone('');
      setChannel(null);
      setRole('USER' as ParticipantRole);
      onClose();
    },
  });

  const canSubmit = phone.trim() && channel && role;

  return (
    <Stack gap="md">
      <Input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Participant phone"
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
      <Select
        value={role}
        onChange={(v) => setRole(v as ParticipantRole)}
        data={[
          { value: 'USER', label: 'User' },
          { value: 'PATIENT', label: 'Patient' },
          { value: 'DOCTOR', label: 'Doctor' },
          { value: 'NURSE', label: 'Nurse' },
        ]}
        placeholder="Select role"
        clearable
      />
      <Group justify="flex-end" mt="md">
        <Button variant="default" onClick={onClose}>
          Cancel
        </Button>
        <Button
          disabled={!canSubmit || addMutation.isPending}
          onClick={() => addMutation.mutate()}
        >
          {addMutation.isPending ? 'Adding...' : 'Add'}
        </Button>
      </Group>
      {addMutation.isError && (
        <Alert icon={<AlertCircle size={16} />} color="red" title="Error">
          {(addMutation.error as Error)?.message || 'Failed to add participant'}
        </Alert>
      )}
    </Stack>
  );
}

function RemoveParticipantForm({
  conversationId,
  onClose,
}: {
  conversationId?: string;
  onClose: () => void;
}) {
  const { data: projections, isLoading } = useQuery({
    queryKey: ['projections', conversationId],
    enabled: Boolean(conversationId),
    queryFn: () => listProjections(conversationId!),
  });

  const removeMutation = useMutation({
    mutationFn: (participantId: string) =>
      removeParticipantProjections({
        conversationId: conversationId!,
        participantId,
      }),
    onSuccess: () => {
      onClose();
    },
  });

  if (isLoading) return <Text>Loading participants...</Text>;

  const uniqueParticipants = projections
    ? projections.reduce<{ id: string; name: string; roles: string[] }[]>((acc, p) => {
        const existing = acc.find((a) => a.id === p.participant.id);
        if (existing) {
          existing.roles.push(p.role);
        } else {
          acc.push({
            id: p.participant.id,
            name:
              [p.participant.firstName, p.participant.lastName].filter(Boolean).join(' ') ||
              p.participant.phone ||
              p.participant.id,
            roles: [p.role],
          });
        }
        return acc;
      }, [])
    : [];

  return (
    <Stack gap="md">
      {uniqueParticipants.length === 0 ? (
        <Text c="dimmed">No participants found</Text>
      ) : (
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Participant</Table.Th>
              <Table.Th>Roles</Table.Th>
              <Table.Th w={60}></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {uniqueParticipants.map((p) => (
              <Table.Tr key={p.id}>
                <Table.Td>{p.name}</Table.Td>
                <Table.Td>{p.roles.join(', ')}</Table.Td>
                <Table.Td>
                  <ActionIcon
                    color="red"
                    variant="light"
                    loading={removeMutation.isPending}
                    onClick={() => {
                      if (window.confirm(`Remove ${p.name} from this conversation?`)) {
                        removeMutation.mutate(p.id);
                      }
                    }}
                  >
                    <Trash2 size={16} />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
      <Group justify="flex-end" mt="md">
        <Button variant="default" onClick={onClose}>
          Close
        </Button>
      </Group>
    </Stack>
  );
}
