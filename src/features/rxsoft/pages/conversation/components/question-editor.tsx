import { Modal } from '@mantine/core';
import { DataPageShell } from '@/features/components/page/data-page-shell';
import type { ModelConfig } from '@/features/shared/model-schema';
import { questionPageSchema } from './conversation-page-schemas';

const config: ModelConfig = questionPageSchema;

export type QuestionFormState = Record<string, unknown>;

export const defaultQuestionForm: QuestionFormState = questionPageSchema.defaultState ?? {};

export function buildQuestionForm(row: Record<string, unknown>): QuestionFormState {
  return questionPageSchema.buildFormState?.(row) ?? row;
}

export function buildQuestionPayload(form: QuestionFormState): unknown {
  return questionPageSchema.buildCreatePayload?.(form) ?? form;
}

export function QuestionEditorDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Modal opened={open} onClose={() => onOpenChange(false)} title="Question Editor" size="xl">
      <DataPageShell config={config} embedded />
    </Modal>
  );
}

export function QuestionnaireQuestionsManager() {
  return <DataPageShell config={config} embedded />;
}
