import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Link2,
  Pencil,
  Save,
  ShieldAlert,
} from 'lucide-react'
import { notifications } from '@mantine/notifications'
import { Card, TextInput, Divider, Badge, Button, Modal, ScrollArea, Stack, Text, Title, Group } from '@mantine/core'

import { AsyncSelectField } from '@/features/components/form/async-field'
import { JsonEditorField } from '@/features/components/json-editor-field'
import { RxPage } from '@/features/components/rx-page'
import { conversationApi } from '@/lib/conversation-api'
import { buildWorkflowAttachmentValidation } from './workflow-configuration-utils'
import {
  DialogActions,
  LabelField,
  getString,
  normalizeRows,
  useConversationCrud,
  useConversationList,
} from './shared'

type MappingRow = {
  questionId?: string
  questionAttribute: string
  workflowStepId?: string
}

const EMPTY_STEP_VALUE = '__none__'

export function RxWorkflowConfigurationPage() {
  const queryClient = useQueryClient()
  const [viewIndex, setViewIndex] = useState(0)
  const [questionnaireId, setQuestionnaireId] = useState('')
  const [workflowId, setWorkflowId] = useState('')
  const [workflowVersion, setWorkflowVersion] = useState('1')
  const [attachmentId, setAttachmentId] = useState<string | null>(null)
  const [mappings, setMappings] = useState<MappingRow[]>([])
  const [showStepEditor, setShowStepEditor] = useState(false)
  const [editableSteps, setEditableSteps] = useState<Record<string, unknown>[]>([])
  const [backendValidation, setBackendValidation] = useState<Record<string, unknown> | null>(null)
  const [selectedStepIndex, setSelectedStepIndex] = useState<number | null>(null)
  const [selectedStep, setSelectedStep] = useState<Record<string, any> | null>(null)

  const questionnairesQuery = useConversationList('/questionnaires', '')
  const questionsQuery = useConversationList(
    '/questions',
    '',
    questionnaireId ? { questionnaireId } : undefined
  )
  const workflowsQuery = useConversationList('/workflows', '')
  const { updateMutation } = useConversationCrud('/workflows')

  const workflowQuery = useQuery({
    queryKey: ['workflow-config', 'workflow', workflowId],
    queryFn: async () => {
      const response = await conversationApi.get(`/workflows/${workflowId}`)
      return response.data as Record<string, unknown>
    },
    enabled: Boolean(workflowId),
  })

  const orderedQuestions = useMemo(() => {
    return normalizeRows(questionsQuery.data ?? []).sort(
      (a, b) => Number(a.index ?? 0) - Number(b.index ?? 0)
    )
  }, [questionsQuery.data])

  const workflowRow = useMemo(() => {
    if (workflowQuery.data) {
      return workflowQuery.data
    }
    return (
      normalizeRows(workflowsQuery.data ?? []).find(
        (row) => String(row.id ?? '') === workflowId
      ) ?? null
    )
  }, [workflowId, workflowQuery.data, workflowsQuery.data])

  const workflowSteps = useMemo(() => {
    const steps = workflowRow?.steps
    return Array.isArray(steps) ? (steps as Record<string, unknown>[]) : []
  }, [workflowRow])

  const validation = useMemo(() => {
    return buildWorkflowAttachmentValidation({
      workflow: workflowRow
        ? {
          id: String(workflowRow.id ?? ''),
          version: Number(workflowVersion || workflowRow.version || 1),
          steps: workflowSteps.map((step) => ({
            id: String(step.id ?? ''),
            type: String(step.type ?? ''),
            config: (step.config as Record<string, unknown> | undefined) ?? {},
            transitions: Array.isArray(step.transitions)
              ? (step.transitions as Array<{
                event: string
                condition?: string
                nextStepId: string
              }>)
              : [],
          })),
        }
        : null,
      questions: orderedQuestions.map((question) => ({
        id: String(question.id ?? ''),
        attribute: String(question.attribute ?? ''),
        index: Number(question.index ?? 0),
      })),
      mappings,
    })
  }, [mappings, orderedQuestions, workflowRow, workflowSteps, workflowVersion])

  useEffect(() => {
    if (!workflowRow) return
    setWorkflowVersion(String(workflowRow.version ?? 1))
    setEditableSteps(workflowSteps)
  }, [workflowRow, workflowSteps])

  useEffect(() => {
    setMappings((current) => {
      const next = orderedQuestions.map((question) => {
        const existing = current.find(
          (mapping) => mapping.questionAttribute === String(question.attribute ?? '')
        )
        return {
          questionId: String(question.id ?? ''),
          questionAttribute: String(question.attribute ?? ''),
          workflowStepId: existing?.workflowStepId,
        }
      })

      if (JSON.stringify(next) === JSON.stringify(current)) {
        return current
      }

      return next
    })
  }, [orderedQuestions])

  const saveDraftMutation = useMutation({
    mutationFn: async () => {
      const payload = buildAttachmentPayload({
        questionnaireId,
        workflowId,
        workflowVersion,
        mappings,
      })

      if (attachmentId) {
        const response = await conversationApi.patch(
          `/workflow-attachments/${attachmentId}`,
          payload
        )
        return response.data
      }

      const response = await conversationApi.post('/workflow-attachments', payload)
      return response.data
    },
    onSuccess: (data) => {
      const nextId = String(data.id ?? data._id ?? '')
      if (nextId) {
        setAttachmentId(nextId)
      }
      notifications.show({ message: 'Workflow attachment draft saved', color: 'green' })
    },
    onError: (error: any) => {
      notifications.show({ message: error?.response?.data?.message ?? 'Unable to save draft', color: 'red' })
    },
  })

  const validateMutation = useMutation({
    mutationFn: async () => {
      const payload = buildAttachmentPayload({
        questionnaireId,
        workflowId,
        workflowVersion,
        mappings,
      })
      const response = await conversationApi.post('/workflow-attachments/validate', payload)
      return response.data
    },
    onSuccess: (data) => {
      setBackendValidation(data)
      notifications.show({
        message: data.valid ? 'Attachment validated successfully' : 'Validation completed with issues',
        color: 'green'
      })
    },
    onError: (error: any) => {
      notifications.show({ message: error?.response?.data?.message ?? 'Unable to validate attachment', color: 'red' })
    },
  })

  const attachMutation = useMutation({
    mutationFn: async () => {
      let nextAttachmentId = attachmentId
      if (!nextAttachmentId) {
        const saved = await saveDraftMutation.mutateAsync()
        nextAttachmentId = String(saved.id ?? saved._id ?? '')
        setAttachmentId(nextAttachmentId)
      }

      const response = await conversationApi.post(
        `/workflow-attachments/${nextAttachmentId}/attach`
      )
      return response.data
    },
    onSuccess: (data) => {
      setBackendValidation(data.validation ?? null)
      notifications.show({
        message: data.attached ? 'Workflow attached to questionnaire' : 'Attachment not applied',
        color: 'green'
      })
    },
    onError: (error: any) => {
      notifications.show({ message: error?.response?.data?.message ?? 'Unable to attach workflow', color: 'red' })
    },
  })

  const stepOptions = useMemo(() => {
    return [
      { value: EMPTY_STEP_VALUE, label: 'No step selected' },
      ...workflowSteps.map((step) => ({
        value: String(step.id ?? ''),
        label: `${String(step.id ?? '')} (${String(step.type ?? 'STEP')})`,
      })),
    ]
  }, [workflowSteps])

  const canGoNext = Boolean(questionnaireId && workflowId)
  const canAttach = canGoNext && validation.valid
  const currentQuestionnaire = useMemo(() => {
    return normalizeRows(questionnairesQuery.data ?? []).find(
      (row) => String(row.id ?? '') === questionnaireId
    )
  }, [questionnaireId, questionnairesQuery.data])

  function applyMappingsToSteps(
    steps: Record<string, any>[],
    mappings: MappingRow[]
  ) {
    const attributeByStepId = new Map<string, string>()

    for (const mapping of mappings) {
      if (mapping.workflowStepId && mapping.questionAttribute) {
        attributeByStepId.set(mapping.workflowStepId, mapping.questionAttribute)
      }
    }

    return steps.map((step) => {
      const attribute = attributeByStepId.get(String(step.id))

      return {
        ...step,
        config: {
          ...(step.config ?? {}),
          stepAttribute: attribute || undefined, // 🔥 key line
        },
      }
    })
  }

  useEffect(() => {
    setEditableSteps((currentSteps) =>
      applyMappingsToSteps(currentSteps, mappings)
    )
  }, [mappings])

  function displayStepsEditor() {
    setSelectedStep(null) // 🔥 important
    setShowStepEditor(true)
  }

  function updateWorkflow() {
    if (!workflowId) return
    let updatedSteps;
    if (selectedStepIndex && selectedStep) {
      const updatedSteps = [...editableSteps]
      updatedSteps[selectedStepIndex] = selectedStep
    } else {
      updatedSteps = editableSteps
    }

    updateMutation.mutate(
      {
        id: workflowId,
        payload: {
          steps: updatedSteps,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['workflow-config', 'workflow', workflowId],
          })
          queryClient.invalidateQueries({
            queryKey: ['conversation-engine', '/workflows'],
          })
          setShowStepEditor(false)
          notifications.show({ message: 'Workflow steps updated', color: 'green' })
        },
      }
    )
  }

  function buildMappingsFromSteps(steps: any, questions: any) {
    return questions.map((q: any) => {
      const step = steps.find(
        (s: any) => s.config?.stepAttribute === q.attribute
      )

      return {
        questionId: q.id,
        questionAttribute: q.attribute,
        workflowStepId: step?.id
      }
    })
  }



  return (
    <RxPage
      title='Workflow Configuration'
      description='Attach a workflow version to a questionnaire, map questions to steps, and validate attribute dependencies before activation.'
      actions={
        <>
          <Button
            type='button'
            variant='outline'
            onClick={() => setViewIndex((current) => Math.max(0, current - 1))}
            disabled={viewIndex === 0}
          >
            <ChevronLeft className='size-4' />
            Previous
          </Button>
          <Button
            type='button'
            onClick={() => setViewIndex((current) => Math.min(1, current + 1))}
            disabled={!canGoNext || viewIndex === 1}
          >
            Next
            <ChevronRight className='size-4' />
          </Button>
        </>
      }
    >
      <Card>
        <Group justify='space-between' align='center' mb='md'>
          <div>
            <Title order={4}>Configuration Flow</Title>
            <Text size='sm' c='dimmed'>
              Move through selection and mapping with draft-safe validation.
            </Text>
          </div>
          <Group gap='xs'>
            <Badge variant={viewIndex === 0 ? 'default' : 'outline'}>1. Select</Badge>
            <ChevronRight className='size-4 text-muted-foreground' />
            <Badge variant={viewIndex === 1 ? 'default' : 'outline'}>
              2. Map + Validate
            </Badge>
          </Group>
        </Group>
      </Card>

      {viewIndex === 0 ? (
        <Card mt='md'>
          <Stack gap='md'>
            <Title order={4}>Choose Questionnaire and Workflow</Title>
            <Text size='sm' c='dimmed'>
              Pick the questionnaire, workflow, and version you want to configure.
            </Text>
          </Stack>
          <Group grow mt='md' align='flex-end'>
            <Stack gap={4}>
              <Text size='sm' fw={500}>Questionnaire</Text>
              <AsyncSelectField
                value={questionnaireId}
                field={{
                  name: 'questionnaireId',
                  label: 'Questionnaire',
                  type: 'async-select',
                  endpoint: '/questionnaires',
                  searchParam: 'search',
                  minChars: 0,
                  valueKey: 'id',
                  labelKey: 'name',
                  placeholder: 'Search questionnaire',
                }}
                onChange={setQuestionnaireId}
                apiClient={conversationApi}
              />
            </Stack>
            <Stack gap={4}>
              <Text size='sm' fw={500}>Workflow</Text>
              <AsyncSelectField
                value={workflowId}
                field={{
                  name: 'workflowId',
                  label: 'Workflow',
                  type: 'async-select',
                  endpoint: '/workflows',
                  searchParam: 'search',
                  minChars: 0,
                  valueKey: 'id',
                  labelKey: 'name',
                  placeholder: 'Search workflow',
                }}
                onChange={setWorkflowId}
                apiClient={conversationApi}
              />
            </Stack>
            <TextInput
              label='Version'
              value={workflowVersion}
              onChange={(event) => setWorkflowVersion(event.target.value)}
              inputMode='numeric'
              placeholder='Workflow version'
            />
          </Group>
        </Card>
      ) : (
        <Group grow align='flex-start' mt='md' gap='md'>
          <Card style={{ flex: 1, minHeight: 620 }}>
            <Stack gap='xs'>
              <Title order={5}>Questions</Title>
              <Text size='sm' c='dimmed'>
                Ordered questionnaire questions drive attribute collection order.
              </Text>
            </Stack>
            <ScrollArea h={520} mt='md'>
              <Stack gap='sm'>
                  {orderedQuestions.map((question, index) => (
                    <div
                      key={String(question.id ?? question.attribute ?? index)}
                      className='rounded-lg border p-3'
                    >
                      <div className='text-sm font-medium'>Q{index + 1}</div>
                      <div className='mt-1 text-sm'>{getString(question.text)}</div>
                      <div className='mt-2 font-mono text-xs text-muted-foreground'>
                        attribute: {getString(question.attribute)}
                      </div>
                    </div>
                  ))}
              </Stack>
            </ScrollArea>
          </Card>

          <Card style={{ flex: 1, minHeight: 620 }}>
            <Group justify='space-between' align='center'>
              <div>
                <Title order={5}>Workflow Steps</Title>
                <Text size='sm' c='dimmed'>
                  Match each question attribute to a workflow step. Empty mappings are allowed.
                </Text>
              </div>
              <Button
                variant='outline'
                onClick={displayStepsEditor}
                disabled={!workflowId}
              >
                Edit Steps
              </Button>
            </Group>
            <ScrollArea h={520} mt='md'>
                <div className='space-y-3'>
                  {orderedQuestions.map((question, index) => {
                    const mapping =
                      mappings.find(
                        (entry) =>
                          entry.questionAttribute === String(question.attribute ?? '')
                      ) ?? null
                    const stepId = mapping?.workflowStepId
                    const step = workflowSteps.find(
                      (item) => String(item.id ?? '') === String(stepId ?? '')
                    )

                    return (
                      <div
                        key={String(question.id ?? question.attribute ?? index)}
                        className='rounded-lg border p-3'
                      >
                        <div className='flex items-start justify-between gap-3'>
                          <div>
                            <div className='text-sm font-medium'>
                              Mapping for {String(question.attribute ?? `Q${index + 1}`)}
                            </div>
                            <div className='mt-1 text-xs text-muted-foreground'>
                              Choose the workflow step that should align with this question.
                            </div>
                          </div>
                          <Badge variant={step ? 'default' : 'outline'}>
                            {step ? String(step.type ?? 'STEP') : 'Unmapped'}
                          </Badge>
                        </div>
                        <div className='mt-3'>
                          <StepSelect
                            value={stepId ?? EMPTY_STEP_VALUE}
                            options={stepOptions}
                            onChange={(value) => {
                              setMappings((current) =>
                                current.map((entry) =>
                                  entry.questionAttribute === String(question.attribute ?? '')
                                    ? {
                                      ...entry,
                                      questionId: String(question.id ?? ''),
                                      workflowStepId:
                                        value === EMPTY_STEP_VALUE ? undefined : value,
                                    }
                                    : entry
                                )
                              )
                            }}
                          />
                        </div>
                        <div className='mt-3 rounded-md bg-muted/40 p-3 text-xs text-muted-foreground'>
                          {step ? (
                            <>
                              <div className='font-mono text-foreground'>
                                [{String(step.id ?? '')}] {String(step.type ?? '')}
                              </div>
                              <Button
                                size='icon'
                                variant='ghost'
                                onClick={() => {
                                  const index = editableSteps.findIndex(
                                    (s) => String(s.id) === String(step.id)
                                  )

                                  setSelectedStepIndex(index)
                                  setSelectedStep(editableSteps[index])
                                  setShowStepEditor(true)
                                }}
                              >
                                <Pencil className='size-4' />
                              </Button>
                              <Button
                                size='icon'
                                variant='ghost'
                                onClick={updateWorkflow}
                              >
                                <Save className='size-4' />
                              </Button>
                              <div className='mt-2'>
                                transitions:{' '}
                                {Array.isArray(step.transitions)
                                  ? step.transitions.length
                                  : 0}
                              </div>
                            </>
                          ) : (
                            'No workflow step is mapped to this question yet.'
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
            </ScrollArea>
          </Card>

          <Card style={{ width: 360, minHeight: 620 }}>
            <Stack gap='xs'>
              <Title order={5}>Real-Time Validation</Title>
              <Text size='sm' c='dimmed'>
                Frontend checks update instantly while backend validation remains available before attach.
              </Text>
            </Stack>
            <Stack gap='md' mt='md'>
              <div className='flex flex-wrap gap-2'>
                <Badge
                  variant={validation.summary.errors > 0 ? 'destructive' : 'default'}
                >
                  Errors: {validation.summary.errors}
                </Badge>
                <Badge variant='outline'>
                  Warnings: {validation.summary.warnings}
                </Badge>
                <Badge variant='secondary'>
                  Passes: {validation.summary.successes}
                </Badge>
              </div>

              <Divider />

              <ScrollArea h={360}>
                <Stack gap='sm'>
                  {validation.issues.map((issue, index) => (
                    <div
                      key={`${issue.code}-${issue.stepId ?? issue.questionAttribute ?? index}`}
                      className='rounded-lg border p-3 text-sm'
                    >
                      <div className='flex items-start gap-2'>
                        {issue.level === 'success' ? (
                          <CheckCircle2 className='mt-0.5 size-4 text-emerald-600' />
                        ) : issue.level === 'warning' ? (
                          <ShieldAlert className='mt-0.5 size-4 text-amber-600' />
                        ) : (
                          <CircleAlert className='mt-0.5 size-4 text-red-600' />
                        )}
                        <div className='min-w-0'>
                          <div>{issue.message}</div>
                          {issue.stepId ? (
                            <div className='mt-1 font-mono text-xs text-muted-foreground'>
                              step: {issue.stepId}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                  {validation.issues.length === 0 ? (
                    <div className='rounded-lg border border-dashed p-4 text-sm text-muted-foreground'>
                      Start mapping questions to steps to see validation feedback.
                    </div>
                  ) : null}
                </Stack>
              </ScrollArea>

              <Divider />

              <div className='space-y-2 text-xs text-muted-foreground'>
                <div className='font-semibold text-foreground'>
                  Available Attributes
                </div>
                <div className='flex flex-wrap gap-2'>
                  {validation.availableAttributes.map((attribute) => (
                    <Badge key={attribute} variant='outline'>
                      {attribute}
                    </Badge>
                  ))}
                </div>
              </div>

              {backendValidation ? (
                <>
                  <Divider />
                  <div className='space-y-2 text-xs'>
                    <div className='font-semibold text-foreground'>
                      Backend Validation
                    </div>
                    <pre className='max-h-40 overflow-auto rounded-md bg-muted/40 p-3'>
                      {JSON.stringify(backendValidation, null, 2)}
                    </pre>
                  </div>
                </>
              ) : null}
            </Stack>
          </Card>
        </Group>
      )}

      {viewIndex === 1 ? (
        <Card mt='md'>
          <Stack gap='xs'>
            <Title order={5}>Attachment Actions</Title>
            <Text size='sm' c='dimmed'>
              Save a reusable draft, validate against backend rules, or attach the workflow to the selected questionnaire.
            </Text>
          </Stack>
          <Group gap='sm' mt='md'>
            <Button
              type='button'
              variant='outline'
              onClick={() => saveDraftMutation.mutate()}
              disabled={!canGoNext || saveDraftMutation.isPending}
            >
              <Save className='size-4' />
              Save Draft
            </Button>
            <Button
              type='button'
              variant='outline'
              onClick={() => validateMutation.mutate()}
              disabled={!canGoNext || validateMutation.isPending}
            >
              <ShieldAlert className='size-4' />
              Validate
            </Button>
            <Button
              type='button'
              onClick={() => attachMutation.mutate()}
              disabled={!canAttach || attachMutation.isPending}
            >
              <Link2 className='size-4' />
              Attach
            </Button>
            <div className='flex min-h-10 items-center text-sm text-muted-foreground'>
              {currentQuestionnaire
                ? `Questionnaire: ${String(
                  currentQuestionnaire.name ??
                  currentQuestionnaire.code ??
                  questionnaireId
                )}`
                : null}
            </div>
          </Group>
        </Card>
      ) : null}
      <Modal
  opened={showStepEditor}
  onClose={() => {
    setShowStepEditor(false)
    setSelectedStep(null)
    setSelectedStepIndex(null)
  }}
  title="Edit Step"
  size="lg"
  styles={{
    body: { paddingTop: 0 },
  }}
>
  <Text size="sm" c="dimmed" mb="md">
    Modify this workflow step configuration.
  </Text>

  <ScrollArea.Autosize mah="70vh">
    <Stack gap="md">
      {selectedStep ? (
        <JsonEditorField
          value={selectedStep}
          onChange={(value) => {
            setSelectedStep(value as Record<string, any>)
          }}
        />
      ) : (
        <JsonEditorField
          value={editableSteps}
          onChange={(value) =>
            setEditableSteps(
              Array.isArray(value) ? value : (editableSteps as any) // TODO: resolve
            )
          }
        />
      )}

      <DialogActions
        submitLabel="Save Step"
        onCancel={() => {
          setShowStepEditor(false)
          setSelectedStep(null)
          setSelectedStepIndex(null)
        }}
        onSubmit={updateWorkflow}
      />
    </Stack>
  </ScrollArea.Autosize>
</Modal>
    </RxPage>
  )
}

function buildAttachmentPayload({
  questionnaireId,
  workflowId,
  workflowVersion,
  mappings,
}: {
  questionnaireId: string
  workflowId: string
  workflowVersion: string
  mappings: MappingRow[]
}) {
  return {
    questionnaireId,
    workflowId,
    workflowVersion: Number(workflowVersion || 1),
    mappings: mappings.map((mapping) => ({
      questionId: mapping.questionId,
      questionAttribute: mapping.questionAttribute,
      workflowStepId: mapping.workflowStepId || undefined,
    })),
  }
}

function StepSelect({
  value,
  options,
  onChange,
}: {
  value: string
  options: Array<{ value: string; label: string }>
  onChange: (value: string) => void
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs'
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
