import { useEffect, useMemo, useState } from 'react'
import { Pencil, Plus } from 'lucide-react'
import { Button, Modal, TextInput, Textarea, Switch, Text, Stack, Grid, Group, Input } from '@mantine/core'
import { AsyncSelectField } from '@/features/components/form/async-field'
import { DragAndDropList } from '@/features/components/drag-and-drop-list'
import { JsonEditorField } from '@/features/components/json-editor-field'
import { MultiSelectField } from '@/features/components/form/multiselect'
import { SelectField } from '@/features/components/form/select'
import { conversationApi } from '@/lib/conversation-api'
import {
  PROCESS_MODE_OPTIONS,
  QUESTION_TYPE_OPTIONS,
  RENDER_MODE_OPTIONS,
  VALIDATION_RULE_OPTIONS,
} from '../types/constants'
import {
  AddRowButton,
  DialogActions,
  InlineSection,
  LabelField,
  getBoolean,
  getObject,
  getString,
  normalizeRows,
  useConversationCrud,
  useConversationList,
} from './shared'

type EmbeddedOption = {
  key: string
  label: string
  value: string
  index: number
}

export type QuestionFormState = {
  id?: string
  questionnaireId: string
  questionType: string
  text: string
  attribute: string
  index: number
  description: string
  renderMode: string
  processMode: string
  validationRules: string[]
  containsLink: boolean
  isRequired: boolean
  isActive: boolean
  aiConfig: Record<string, unknown>
  apiNavigation: Record<string, unknown>
  metadata: Record<string, unknown>
  optionType: 'embedded' | 'option-list' | 'option-source'
  options: EmbeddedOption[]
  optionListId: string
  optionSource: Record<string, unknown>
}

export const defaultQuestionForm: QuestionFormState = {
  questionnaireId: '',
  questionType: 'text',
  text: '',
  attribute: '',
  index: 1,
  description: '',
  renderMode: 'input',
  processMode: 'none',
  validationRules: [],
  containsLink: false,
  isRequired: false,
  isActive: true,
  aiConfig: {},
  apiNavigation: {},
  metadata: {},
  optionType: 'embedded',
  options: [],
  optionListId: '',
  optionSource: {},
}

export function buildQuestionForm(row: Record<string, unknown>): QuestionFormState {
  const optionType =
    Array.isArray(row.options) && row.options.length > 0
      ? 'embedded'
      : row.optionListId
        ? 'option-list'
        : 'option-source'

  return {
    id: String(row.id),
    questionnaireId: getString(row.questionnaireId),
    questionType: getString(row.questionType || 'text'),
    text: getString(row.text),
    attribute: getString(row.attribute),
    index: Number(row.index ?? 1),
    description: getString(row.description),
    renderMode: getString(row.renderMode || 'input'),
    processMode: getString(row.processMode || 'none'),
    validationRules: Array.isArray(row.validationRules)
      ? row.validationRules.map((rule) =>
        typeof rule === 'string'
          ? rule
          : String((rule as Record<string, unknown>).type ?? '')
      )
      : [],
    containsLink: getBoolean(row.hasLink),
    isRequired: getBoolean(row.isRequired),
    isActive: getBoolean(row.isActive),
    aiConfig: getObject(row.aiConfig),
    apiNavigation: getObject(row.apiNavigation),
    metadata: getObject(row.metadata),
    optionType,
    options: Array.isArray(row.options)
      ? row.options.map((option, index) => {
        const item = option as Record<string, unknown>
        return {
          key: getString(item.key),
          label: getString(item.label),
          value: getString(item.value),
          index: Number(item.index ?? index + 1),
        }
      })
      : [],
    optionListId: getString(row.optionListId),
    optionSource: getObject(row.optionSource),
  }
}

function buildNavigationIds(
  orderedRows: Record<string, unknown>[],
  form: QuestionFormState
) {
  const relatedQuestions = orderedRows
    .filter(
      (row) =>
        String(row.questionnaireId ?? '') === form.questionnaireId &&
        String(row.id) !== form.id
    )
    .map((row) => ({
      id: String(row.id),
      index: Number(row.index ?? 0),
    }))

  const sorted = [...relatedQuestions, { id: form.id ?? '__new__', index: form.index }].sort(
    (left, right) => left.index - right.index
  )
  const currentIndex = sorted.findIndex((item) => item.id === (form.id ?? '__new__'))

  return {
    previousQuestionId: currentIndex > 0 ? sorted[currentIndex - 1]?.id : undefined,
    nextQuestionId: currentIndex >= 0 ? sorted[currentIndex + 1]?.id : undefined,
  }
}

export function buildQuestionPayload(
  form: QuestionFormState,
  orderedRows: Record<string, unknown>[]
) {
  const navigation = buildNavigationIds(orderedRows, form)

  return {
    questionnaireId: form.questionnaireId,
    questionType: form.questionType,
    text: form.text.trim(),
    attribute: form.attribute.trim() || undefined,
    index: Number(form.index),
    description: form.description.trim() || undefined,
    renderMode: form.renderMode,
    processMode: form.processMode,
    validationRules: form.validationRules.map((type) => ({ type })),
    hasLink: form.containsLink,
    isRequired: form.isRequired,
    isActive: form.isActive,
    aiConfig: form.aiConfig,
    apiNavigation: form.apiNavigation,
    metadata: form.metadata,
    previousQuestionId: navigation.previousQuestionId,
    nextQuestionId: navigation.nextQuestionId,
    options:
      form.optionType === 'embedded'
        ? form.options.map((option, index) => ({ ...option, index: index + 1 }))
        : undefined,
    optionListId:
      form.optionType === 'option-list' ? form.optionListId || undefined : undefined,
    optionSource: form.optionType === 'option-source' ? form.optionSource : undefined,
  }
}

export function QuestionEditorDialog({
  open,
  onOpenChange,
  form,
  setForm,
  onSubmit,
  loading,
  questionnaireLocked = false,
  minIndex = 1,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  form: QuestionFormState
  setForm: React.Dispatch<React.SetStateAction<QuestionFormState>>
  onSubmit: () => void
  loading?: boolean
  questionnaireLocked?: boolean
  minIndex?: number
}) {
  return (
    <Modal
      opened={open}
      onClose={() => onOpenChange(false)}
      title={form.id ? 'Edit Question' : 'Create Question'}
      size="xl"
      centered
    >
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Configure question behavior, rendering, options, and flow.
        </Text>

        {/* FORM CONTENT HERE */}
        <div className='grid gap-4'>
          <div className='grid gap-4 md:grid-cols-12'>
            <div className='md:col-span-3'>
              <LabelField label='Questionnaire'>
                <AsyncSelectField
                  value={form.questionnaireId}
                  field={{
                    name: 'questionnaireId',
                    label: 'Questionnaire',
                    type: 'async-select',
                    endpoint: '/questionnaires',
                    searchParam: 'search',
                    minChars: 0,
                    valueKey: 'id',
                    labelKey: 'name',
                    placeholder: 'Select questionnaire',
                  }}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      questionnaireId: questionnaireLocked ? current.questionnaireId : value,
                    }))
                  }
                  apiClient={conversationApi}
                />
              </LabelField>
            </div>
            <div className='md:col-span-2'>
              <LabelField label='Question Type'>
                <SelectField
                  value={form.questionType}
                  onChange={(value) => setForm((current) => ({ ...current, questionType: value }))}
                  options={QUESTION_TYPE_OPTIONS}
                  placeholder='Select type'
                />
              </LabelField>
            </div>
            <div className='md:col-span-2'>
              <LabelField label='Attribute'>
                <Input
                  value={form.attribute}
                  onChange={(event: any) =>
                    setForm((current) => ({ ...current, attribute: event.target.value }))
                  }
                />
              </LabelField>
            </div>
            <div className='md:col-span-4'>
              <LabelField label='Text'>
                <Input
                  value={form.text}
                  onChange={(event: any) =>
                    setForm((current) => ({ ...current, text: event.target.value }))
                  }
                />
              </LabelField>
            </div>
            <div className='md:col-span-1'>
              <LabelField label='Index'>
                <Input
                  type='number'
                  min={minIndex}
                  value={String(form.index)}
                  onChange={(event: any) =>
                    setForm((current) => ({
                      ...current,
                      index: Math.max(minIndex, Number(event.target.value) || minIndex),
                    }))
                  }
                />
              </LabelField>
            </div>
          </div>

          <div className='grid gap-4 md:grid-cols-12'>
            <div className='md:col-span-6'>
              <LabelField label='Render Mode'>
                <SelectField
                  value={form.renderMode}
                  onChange={(value) => setForm((current) => ({ ...current, renderMode: value }))}
                  options={RENDER_MODE_OPTIONS}
                  placeholder='Select render mode'
                />
              </LabelField>
            </div>
            <div className='md:col-span-6'>
              <LabelField label='Process Mode'>
                <SelectField
                  value={form.processMode}
                  onChange={(value) => setForm((current) => ({ ...current, processMode: value }))}
                  options={PROCESS_MODE_OPTIONS}
                  placeholder='Select process mode'
                />
              </LabelField>
            </div>
          </div>

          <div className='grid gap-4 md:grid-cols-2'>
            <div className='md:col-span-2'>
              <LabelField label='Description'>
                <Textarea
                  rows={4}
                  value={form.description}
                  onChange={(event: any) =>
                    setForm((current) => ({ ...current, description: event.target.value }))
                  }
                />
              </LabelField>
            </div>
            <LabelField label='Validation Rules'>
              <MultiSelectField
                value={form.validationRules}
                onChange={(validationRules) =>
                  setForm((current) => ({ ...current, validationRules }))
                }
                options={VALIDATION_RULE_OPTIONS}
                placeholder='Select validation rules'
              />
            </LabelField>
            <LabelField label='Required'>
              <div className='flex h-9 items-center rounded-md border px-3'>
                <Switch
                  checked={form.isRequired}
                  onChange={(checked) =>
                    setForm((current: any) => ({ ...current, isRequired: checked }))
                  }
                />
              </div>
            </LabelField>
            <LabelField label='Contains Link'>
              <div className='flex h-9 items-center rounded-md border px-3'>
                <Switch
                  checked={form.containsLink}
                  onChange={(checked) =>
                    setForm((current: any) => ({ ...current, containsLink: checked }))
                  }
                />
              </div>
            </LabelField>
            <LabelField label='Active'>
              <div className='flex h-9 items-center rounded-md border px-3'>
                <Switch
                  checked={form.isActive}
                  onChange={(checked) =>
                    setForm((current: any) => ({ ...current, isActive: checked }))
                  }
                />
              </div>
            </LabelField>
          </div>

          <InlineSection title='Option Configuration'>
            <div className='grid gap-4 md:grid-cols-2'>
              <LabelField label='Option Type'>
                <SelectField
                  value={form.optionType}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      optionType: value as QuestionFormState['optionType'],
                    }))
                  }
                  options={[
                    { value: 'embedded', label: 'Embedded' },
                    { value: 'option-list', label: 'Option List' },
                    { value: 'option-source', label: 'Option Source' },
                  ]}
                  placeholder='Select option type'
                />
              </LabelField>
              {form.optionType === 'option-list' ? (
                <LabelField label='Option List'>
                  <AsyncSelectField
                    value={form.optionListId}
                    field={{
                      name: 'optionListId',
                      label: 'Option List',
                      type: 'async-select',
                      endpoint: '/option-lists',
                      searchParam: 'search',
                      valueKey: 'id',
                      labelKey: 'name',
                      placeholder: 'Select option list',
                    }}
                    onChange={(value) =>
                      setForm((current) => ({ ...current, optionListId: value }))
                    }
                    apiClient={conversationApi}
                  />
                </LabelField>
              ) : null}
              {form.optionType === 'option-source' ? (
                <div className='md:col-span-2'>
                  <LabelField label='Option Source'>
                    <JsonEditorField
                      value={form.optionSource}
                      onChange={(optionSource) =>
                        setForm((current) => ({
                          ...current,
                          optionSource: optionSource as Record<string, unknown>,
                        }))
                      }
                    />
                  </LabelField>
                </div>
              ) : null}
            </div>

            {form.optionType === 'embedded' ? (
              <div className='space-y-3'>
                <AddRowButton
                  label='Add Option'
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      options: [
                        ...current.options,
                        {
                          key: '',
                          label: '',
                          value: '',
                          index: current.options.length + 1,
                        },
                      ],
                    }))
                  }
                />
                <DragAndDropList
                  items={form.options}
                  getKey={(_, index) => `option-${index}`}
                  onChange={(options) =>
                    setForm((current) => ({
                      ...current,
                      options: options.map((option, index) => ({ ...option, index: index + 1 })),
                    }))
                  }
                  onDelete={(_, index) =>
                    setForm((current) => ({
                      ...current,
                      options: current.options.filter(
                        (_, currentIndex) => currentIndex !== index
                      ),
                    }))
                  }
                  columns={[
                    {
                      key: 'key',
                      label: 'Key',
                      render: (item) => (
                        <Input
                          value={item.key}
                          onChange={(event: any) =>
                            setForm((current) => ({
                              ...current,
                              options: current.options.map((option) =>
                                option === item
                                  ? { ...option, key: event.target.value }
                                  : option
                              ),
                            }))
                          }
                        />
                      ),
                    },
                    {
                      key: 'label',
                      label: 'Label',
                      render: (item) => (
                        <Input
                          value={item.label}
                          onChange={(event: any) =>
                            setForm((current) => ({
                              ...current,
                              options: current.options.map((option) =>
                                option === item
                                  ? { ...option, label: event.target.value }
                                  : option
                              ),
                            }))
                          }
                        />
                      ),
                    },
                    {
                      key: 'value',
                      label: 'Value',
                      render: (item) => (
                        <Input
                          value={item.value}
                          onChange={(event: any) =>
                            setForm((current) => ({
                              ...current,
                              options: current.options.map((option) =>
                                option === item
                                  ? { ...option, value: event.target.value }
                                  : option
                              ),
                            }))
                          }
                        />
                      ),
                    },
                  ]}
                />
              </div>
            ) : null}
          </InlineSection>

          <div className='grid gap-4 md:grid-cols-2'>
            <LabelField label='AI Config'>
              <JsonEditorField
                value={form.aiConfig}
                onChange={(aiConfig) =>
                  setForm((current) => ({
                    ...current,
                    aiConfig: aiConfig as Record<string, unknown>,
                  }))
                }
              />
            </LabelField>
            <LabelField label='API Navigation'>
              <JsonEditorField
                value={form.apiNavigation}
                onChange={(apiNavigation) =>
                  setForm((current) => ({
                    ...current,
                    apiNavigation: apiNavigation as Record<string, unknown>,
                  }))
                }
              />
            </LabelField>
            <div className='md:col-span-2'>
              <LabelField label='Metadata'>
                <JsonEditorField
                  value={form.metadata}
                  onChange={(metadata) =>
                    setForm((current) => ({
                      ...current,
                      metadata: metadata as Record<string, unknown>,
                    }))
                  }
                />
              </LabelField>
            </div>
          </div>
        </div>
        <Group justify="flex-end" mt="md">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button onClick={onSubmit} loading={loading}>
            {form.id ? 'Save Changes' : 'Create Question'}
          </Button>
        </Group>
        </Stack>
    </Modal>
  )
}

export function QuestionnaireQuestionsManager({
  questionnaireId,
  onQuestionsChange,
}: {
  questionnaireId?: string
  onQuestionsChange?: (rows: Record<string, unknown>[]) => void
}) {
  const [showDialog, setShowDialog] = useState(false)
  const [form, setForm] = useState<QuestionFormState>(defaultQuestionForm)
  const [orderedRows, setOrderedRows] = useState<Record<string, unknown>[]>([])
  const questionsQuery = useConversationList(
    '/questions',
    '',
    questionnaireId ? { questionnaireId } : undefined
  )
  const { createMutation, updateMutation, deleteMutation } = useConversationCrud('/questions')

  const rows = useMemo(
    () =>
      normalizeRows(questionsQuery.data ?? []).sort(
        (a, b) => Number(a.index ?? 0) - Number(b.index ?? 0)
      ),
    [questionsQuery.data]
  )

  useEffect(() => {
    setOrderedRows(rows)
    onQuestionsChange?.(rows)
  }, [onQuestionsChange, rows])

  async function persistOrder(nextRows: Record<string, unknown>[]) {
    const reindexed = nextRows.map((row, index) => ({ ...row, index: index + 1 }))
    setOrderedRows(reindexed)
    onQuestionsChange?.(reindexed)
    await Promise.all(
      reindexed.map((row) =>
        conversationApi.put(`/questions/${String((row as { id?: string }).id)}`, row)
      )
    )
    questionsQuery.refetch()
  }

  const nextIndex =
    Math.max(0, ...orderedRows.map((row) => Number(row.index ?? 0))) + 1

  function openCreateDialog() {
    setForm({
      ...defaultQuestionForm,
      questionnaireId: questionnaireId ?? '',
      index: nextIndex,
    })
    setShowDialog(true)
  }

  function openEditDialog(row: Record<string, unknown>) {
    setForm(buildQuestionForm(row))
    setShowDialog(true)
  }

  function submitForm() {
    const payload = buildQuestionPayload(form, orderedRows)
    if (form.id) {
      const originalRow = orderedRows.find((row) => String(row.id) === form.id)
      const dirtyPayload =
        originalRow == null
          ? payload
          : Object.fromEntries(
            Object.entries(payload).filter(([key, value]) => {
              return (
                JSON.stringify((originalRow as Record<string, unknown>)[key] ?? null) !==
                JSON.stringify(value ?? null)
              )
            })
          )
      updateMutation.mutate(
        { id: form.id, payload: dirtyPayload },
        { onSuccess: () => setShowDialog(false) }
      )
      return
    }

    createMutation.mutate(payload, {
      onSuccess: () => {
        setShowDialog(false)
        setForm(defaultQuestionForm)
      },
    })
  }

  if (!questionnaireId) {
    return (
      <div className='rounded-lg border border-dashed p-4 text-sm text-muted-foreground'>
        Create the questionnaire first, then reopen it to add, remove, and reorder its
        questions.
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between gap-3'>
        <div>
          <h3 className='text-sm font-semibold'>Questionnaire Questions</h3>
          <p className='text-sm text-muted-foreground'>
            Add, edit, delete, and reorder questions for this questionnaire.
          </p>
        </div>
        <Button type='button' onClick={openCreateDialog}>
          <Plus className='size-4' />
          Add Question
        </Button>
      </div>

      <DragAndDropList
        items={orderedRows}
        getKey={(item) => String(item.id)}
        onChange={persistOrder}
        onDelete={(item) => deleteMutation.mutate(String(item.id))}
        columns={[
          {
            key: 'text',
            label: 'Question Text',
            render: (item) => String(item.text ?? ''),
          },
          {
            key: 'questionType',
            label: 'Type',
            width: '180px',
            render: (item) => String(item.questionType ?? ''),
          },
          {
            key: 'renderMode',
            label: 'Render',
            width: '180px',
            render: (item) => String(item.renderMode ?? ''),
          },
          {
            key: 'edit',
            label: 'Edit',
            width: '120px',
            render: (item) => (
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => openEditDialog(item)}
              >
                <Pencil className='mr-2 size-4' />
                Edit
              </Button>
            ),
          },
        ]}
      />

      <QuestionEditorDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        form={form}
        setForm={setForm}
        onSubmit={submitForm}
        loading={createMutation.isPending || updateMutation.isPending}
        questionnaireLocked
        minIndex={form.id ? 1 : nextIndex}
      />
    </div>
  )
}
