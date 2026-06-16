import { Button, Group, Paper, Text, TextInput, Title } from '@mantine/core';
import { Send } from 'lucide-react';
import { PoLineItem } from '../types';

interface Props {
  lines: PoLineItem[];
  receivedDate: string;
  onReceivedDateChange: (date: string) => void;
  onPostAll: () => void;
  onSaveDraft: () => void;
  onSubmitApprove: () => void;
  saving?: boolean;
  submitting?: boolean;
}

export function PoSummary({
  lines,
  receivedDate,
  onReceivedDateChange,
  onPostAll,
  onSaveDraft,
  onSubmitApprove,
  saving,
  submitting,
}: Props) {
  const totalAmount = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const postedLines = lines.filter((l) => l.isPosted).length;
  const pendingPostLines = lines.filter((l) => !l.isDraft && !l.isPosted && l.receivedQty > 0).length;

  return (
    <Paper p="md" withBorder bg="#c7e6f1">
      <Group justify="space-between">
        <Group gap="xl">
          <TextInput
            label="Received Date"
            type="date"
            size="xs"
            value={receivedDate}
            onChange={(e) => onReceivedDateChange(e.currentTarget.value)}
            w={160}
          />
          <Text size="xs">Lines: {lines.length}</Text>
          <Text size="xs">Posted: {postedLines}</Text>
          <Text size="xs">Pending Post: {pendingPostLines}</Text>
          <Title order={3}>Total: ₦{totalAmount.toFixed(2)}</Title>
        </Group>
        <Group>
          {pendingPostLines > 0 && (
            <Button size="xs" color="green" onClick={onPostAll}>
              Post All ({pendingPostLines})
            </Button>
          )}
          <Button
            size="xs"
            leftSection={<Send size={14} />}
            onClick={onSaveDraft}
            loading={saving}
          >
            Save as Draft
          </Button>
          <Button
            size="xs"
            color="green"
            leftSection={<Send size={14} />}
            onClick={onSubmitApprove}
            loading={submitting}
          >
            Submit & Approve
          </Button>
        </Group>
      </Group>
    </Paper>
  );
}
