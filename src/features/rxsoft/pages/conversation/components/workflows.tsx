import { useMemo, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Button, TextInput, Modal, Switch, Text, Stack, Grid, Group } from '@mantine/core'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { DragAndDropList } from '@/features/components/drag-and-drop-list'
import { JsonEditorField } from '@/features/components/json-editor-field'
import { PaginatedDataTable } from '@/features/components/paginated-data-table'
import { RxPage } from '@/features/components/rx-page'
import { WORKFLOW_STEP_TYPE_OPTIONS } from '../types/constants'
import {
  AddRowButton,
  DialogActions,
  InlineSection,
  LabelField,
  getObject,
  getString,
  normalizeRows,
  useConversationCrud,
  useConversationList,
} from './shared'
import { SelectField } from '@/features/components/form/select'

type WorkflowStepForm = {
  id: string
  type: string
  config: Record<string, unknown>
  transitions: Array<{
    event: string
    condition?: string
    nextStepId: string
  }>
}

type WorkflowFormState = {
  id?: string
  name: string
  code: string
  metadata: Record<string, unknown>
  version: number
  maxTransitionsPerRun: number
  isActive: boolean
  startStepId: string;
  steps: WorkflowStepForm[]
}

const defaultWorkflowForm: WorkflowFormState = {
  name: '',
  code: '',
  metadata: {},
  version: 1,
  maxTransitionsPerRun: 25,
  isActive: true,
  startStepId: '',
  steps: [],
}

const defaultStep: WorkflowStepForm = {
  id: '',
  type: 'QUESTIONNAIRE',
  config: {},
  transitions: [],
}

export function RxWorkflowsPage() {
  const [search, setSearch] = useState('')
  const [showDialog, setShowDialog] = useState(false)
  const [showStepDialog, setShowStepDialog] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null)
  const [form, setForm] = useState<WorkflowFormState>(defaultWorkflowForm)
  const [stepForm, setStepForm] = useState<WorkflowStepForm>(defaultStep)

  const workflowsQuery = useConversationList('/workflows', search)
  const { createMutation, updateMutation, deleteMutation } =
    useConversationCrud('/workflows')

  const rows = useMemo(
    () => normalizeRows(workflowsQuery.data ?? []),
    [workflowsQuery.data],
  )

  function openEditDialog(row: Record<string, unknown>) {
    setForm({
      id: String(row.id),
      name: getString(row.name),
      code: getString(row.code),
      metadata: getObject(row.metadata),
      version: Number(row.version ?? 1),
      maxTransitionsPerRun: Number(row.maxTransitionsPerRun ?? 25),
      isActive: Boolean(row.isActive),
      startStepId: getString(row.startStepId),
      steps: Array.isArray(row.steps)
        ? row.steps.map((step, index) => {
            const item = step as Record<string, unknown>
            return {
              id: getString(item.id || crypto.randomUUID() || `step-${index}`),
              type: getString(item.type || 'QUESTIONNAIRE'),
              config: getObject(item.config),
              transitions: Array.isArray(item.transitions)
                ? item.transitions.map((transition) => transition as WorkflowStepForm['transitions'][number])
                : [],
            }
          })
        : [],
    })
    setShowDialog(true)
  }

  function openStepDialog(index?: number) {
    if (typeof index === 'number') {
      setEditingStepIndex(index)
      setStepForm(form.steps[index] ?? defaultStep)
    } else {
      setEditingStepIndex(null)
      setStepForm({ ...defaultStep, id: crypto.randomUUID() })
    }
    setShowStepDialog(true)
  }

  function saveStep() {
    const payload = {
      ...stepForm,
      id: stepForm.id || crypto.randomUUID(),
    }

    setForm((current) => {
      const nextSteps = [...current.steps]
      if (editingStepIndex == null) {
        nextSteps.push(payload)
      } else {
        nextSteps[editingStepIndex] = payload
      }
      return { ...current, steps: nextSteps }
    })
    setShowStepDialog(false)
  }

  function submitForm() {
    const payload = {
      name: form.name.trim(),
      code: form.code.trim(),
      metadata: form.metadata,
      version: Number(form.version || 1),
      maxTransitionsPerRun: Number(form.maxTransitionsPerRun || 25),
      steps: form.steps.map((step) => ({
        id: step.id || crypto.randomUUID(),
        type: step.type,
        config: step.config,
        transitions: step.transitions.map((transition) => ({
          event: transition.event,
          condition: transition.condition || undefined,
          nextStepId: transition.nextStepId,
        })),
      })),
      isActive: form.isActive,
      startStepId: form.startStepId
    }

    if (form.id) {
      updateMutation.mutate({ id: form.id, payload }, { onSuccess: () => setShowDialog(false) })
      return
    }

    createMutation.mutate(payload, {
      onSuccess: () => {
        setShowDialog(false)
        setForm(defaultWorkflowForm)
      },
    })
  }

  return (
    <RxPage
      title='Workflows'
      description='Define ordered workflow steps, transition rules, and metadata for orchestration flows.'
      actions={
        <Button type='button' onClick={() => {
          setForm(defaultWorkflowForm)
          setShowDialog(true)
        }}>
          <Plus className='size-4' />
          Add Workflow
        </Button>
      }
    >
      <PaginatedDataTable
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'code', label: 'Code' },
          { key: 'version', label: 'Version' },
          { key: 'maxTransitionsPerRun', label: 'Max Transitions' },
          {
            key: 'isActive',
            label: 'Active',
            render: (row) => (
              <Switch
                checked={Boolean(row.isActive)}
                onChange={(checked: any) =>
                  updateMutation.mutate({
                    id: String(row.id),
                    payload: { isActive: checked },
                  })
                }
              />
            ),
          },
          {
            key: 'actions',
            label: 'Actions',
            render: (row) => (
              <div className='flex gap-2'>
                <Button type='button' size='icon' variant='outline' onClick={() => openEditDialog(row)}>
                  <Pencil className='size-4' />
                </Button>
                <Button type='button' size='icon' variant='outline' onClick={() => setDeleteId(String(row.id))}>
                  <Trash2 className='size-4' />
                </Button>
              </div>
            ),
          },
        ]}
        rows={rows}
        isLoading={workflowsQuery.isLoading}
        isError={workflowsQuery.isError}
        searchValue={search}
        onSearchChange={setSearch}
      />

      <Modal
        opened={showDialog}
        onClose={() => setShowDialog(false)}
        title={form.id ? 'Edit Workflow' : 'Create Workflow'}
        size='xl'
      >
        <Stack gap='md'>
          <Text size='sm' c='dimmed'>Build workflow definitions with ordered steps and explicit transitions.</Text>
          <Grid>
            <Grid.Col span={6}>
              <TextInput label='Name' value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput label='Code' value={form.code} onChange={(event) => setForm((current) => ({ ...current, code: event.target.value }))} />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label='Version'
                type='number'
                min={1}
                value={String(form.version)}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    version: Number(event.target.value || 1),
                  }))
                }
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label='Max Transitions Per Run'
                type='number'
                min={1}
                value={String(form.maxTransitionsPerRun)}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    maxTransitionsPerRun: Number(event.target.value || 25),
                  }))
                }
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Switch
                label='Active'
                checked={form.isActive}
                onChange={(event) => setForm((current) => ({ ...current, isActive: event.currentTarget.checked }))}
                mt='lg'
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <SelectField
                label='Start Step'
                value={form.startStepId}
                options={form.steps.map((step) => ({
                  value: step.id,
                  label: step.id,
                }))}
                onChange={(startStepId) => setForm((current) => ({ ...current, startStepId }))}
                placeholder='Select Start Step'
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <JsonEditorField
                label='Metadata'
                value={form.metadata}
                onChange={(metadata) => setForm((current) => ({ ...current, metadata: metadata as Record<string, unknown> }))}
              />
            </Grid.Col>
          </Grid>

          <InlineSection
            title='Workflow Steps'
            action={<AddRowButton label='Add Step' onClick={() => openStepDialog()} />}
          >
            <DragAndDropList
              items={form.steps}
              getKey={(item) => item.id}
              onChange={(steps) => setForm((current) => ({ ...current, steps }))}
              onDelete={(_, index) =>
                setForm((current) => ({
                  ...current,
                  steps: current.steps.filter((_, currentIndex) => currentIndex !== index),
                }))
              }
              columns={[
                { key: 'type', label: 'Type', width: '180px', render: (item) => item.type },
                {
                  key: 'config',
                  label: 'Config',
                  render: (item) => (
                    <Text
                      size='sm'
                      c='blue'
                      style={{ cursor: 'pointer', textDecoration: 'underline' }}
                      onClick={() => openStepDialog(form.steps.findIndex((step) => step.id === item.id))}
                    >
                      Edit config and transitions
                    </Text>
                  ),
                },
                {
                  key: 'transitions',
                  label: 'Transitions',
                  render: (item) => `${item.transitions.length} transition(s)`,
                },
              ]}
            />
          </InlineSection>

          <DialogActions
            submitLabel={form.id ? 'Save Changes' : 'Create Workflow'}
            loading={createMutation.isPending || updateMutation.isPending}
            onCancel={() => setShowDialog(false)}
            onSubmit={submitForm}
          />
        </Stack>
      </Modal>

      <Modal
        opened={showStepDialog}
        onClose={() => setShowStepDialog(false)}
        title={editingStepIndex == null ? 'Add Step' : 'Edit Step'}
        size='lg'
      >
        <Stack gap='md'>
          <Text size='sm' c='dimmed'>Step IDs stay internal; configure type, config, and transition schema here.</Text>
          <SelectField
            label='Type'
            value={stepForm.type}
            onChange={(value) => setStepForm((current) => ({ ...current, type: value }))}
            options={WORKFLOW_STEP_TYPE_OPTIONS}
            placeholder='Select step type'
          />
          <JsonEditorField
            label='Config'
            value={stepForm.config}
            placeholder='{"action":"HTTP_POST","timeoutMs":5000,"retries":2,"retryStrategy":"fixed"}'
            onChange={(config) => setStepForm((current) => ({ ...current, config: config as Record<string, unknown> }))}
          />
          <JsonEditorField
            label='Transitions'
            value={stepForm.transitions}
            placeholder='[{"event":"ANSWER_VALID","condition":"payload.ok === true","nextStepId":"next-step"}]'
            onChange={(transitions) =>
              setStepForm((current) => ({
                ...current,
                transitions: Array.isArray(transitions)
                  ? (transitions as WorkflowStepForm['transitions'])
                  : current.transitions,
              }))
            }
          />
          <DialogActions submitLabel='Save Step' onCancel={() => setShowStepDialog(false)} onSubmit={saveStep} />
        </Stack>
      </Modal>

      <ConfirmDialog
        open={deleteId != null}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null)
        }}
        title='Delete workflow'
        desc='This will permanently remove the workflow definition.'
        confirmText='Delete'
        destructive
        isLoading={deleteMutation.isPending}
        handleConfirm={() => {
          if (!deleteId) return
          deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId(null) })
        }}
      />
    </RxPage>
  )
}
