import { useMemo, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Button, Modal, Stack, Grid, TextInput, Textarea, Switch, Group, Text } from '@mantine/core'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { JsonEditorField } from '@/features/components/json-editor-field'
import { PaginatedDataTable } from '@/features/components/paginated-data-table'
import { RxPage } from '@/features/components/rx-page'
import { SelectField } from '@/features/components/form/select'
import { PROCESSING_STRATEGY_OPTIONS } from '../types/constants'
import { QuestionnaireQuestionsManager } from './question-editor'
import {
  DialogActions,
  JsonPreviewDialog,
  TagInput,
  getDirtyPayload,
  getBoolean,
  getObject,
  getString,
  normalizeRows,
  useConversationCrud,
  useConversationList,
} from './shared'

type QuestionnaireFormState = {
  id?: string
  name: string
  code: string
  description: string
  allowBackNavigation: boolean
  allowMultipleSessions: boolean
  processingStrategy: string
  tags: string[]
  metadata: Record<string, unknown>
  isActive: boolean
}

const defaultFormState: QuestionnaireFormState = {
  name: '',
  code: '',
  description: '',
  allowBackNavigation: true,
  allowMultipleSessions: false,
  processingStrategy: 'STATIC',
  tags: [],
  metadata: {},
  isActive: true,
}

export function RxQuestionnairesPage() {
  const [search, setSearch] = useState('')
  const [showDialog, setShowDialog] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState<QuestionnaireFormState>(defaultFormState)
  const [initialForm, setInitialForm] = useState<QuestionnaireFormState>(defaultFormState)
  const [questionRows, setQuestionRows] = useState<Record<string, unknown>[]>([])
  const [showSampleJson, setShowSampleJson] = useState(false)

  const questionnairesQuery = useConversationList('/questionnaires', search)
  const { createMutation, updateMutation, deleteMutation } =
    useConversationCrud('/questionnaires')

  const rows = useMemo(
    () => normalizeRows(questionnairesQuery.data ?? []),
    [questionnairesQuery.data],
  )

  function openCreateDialog() {
    setForm(defaultFormState)
    setInitialForm(defaultFormState)
    setQuestionRows([])
    setShowDialog(true)
  }

  function openEditDialog(row: Record<string, unknown>) {
    const nextForm = {
      id: String(row.id),
      name: getString(row.name),
      code: getString(row.code),
      description: getString(row.description),
      allowBackNavigation: getBoolean(row.allowBackNavigation),
      allowMultipleSessions: getBoolean(row.allowMultipleSessions),
      processingStrategy: getString(row.processingStrategy || 'STATIC'),
      tags: Array.isArray(row.tags) ? row.tags.map(String) : [],
      metadata: getObject(row.metadata),
      isActive: getBoolean(row.isActive),
    }
    setForm(nextForm)
    setInitialForm(nextForm)
    setQuestionRows(Array.isArray(row.questions) ? (row.questions as Record<string, unknown>[]) : [])
    setShowDialog(true)
  }

  function submitForm() {
    if (!form.name.trim() || !form.code.trim()) {
      return
    }

    const payload = {
      name: form.name.trim(),
      code: form.code.trim(),
      description: form.description.trim() || undefined,
      allowBackNavigation: form.allowBackNavigation,
      allowMultipleSessions: form.allowMultipleSessions,
      processingStrategy: form.processingStrategy,
      metadata: form.metadata,
      tags: form.tags,
      isActive: form.isActive,
      isDynamic: false,
      version: 1,
    }

    if (form.id) {
      const dirtyPayload = getDirtyPayload(
        initialForm as unknown as Record<string, unknown>,
        payload as unknown as Record<string, unknown>
      )
      updateMutation.mutate(
        { id: form.id, payload: dirtyPayload },
        { onSuccess: () => setShowDialog(false) },
      )
      return
    }

    createMutation.mutate(payload, {
      onSuccess: () => {
        setShowDialog(false)
        setForm(defaultFormState)
      },
    })
  }

  const samplePayload = useMemo(() => {
    return questionRows.reduce<Record<string, unknown>>((accumulator, row, index) => {
      const attribute = getString(row.attribute).trim() || `question_${index + 1}`
      accumulator[attribute] = ''
      return accumulator
    }, {})
  }, [questionRows])

  return (
    <RxPage
      title={'Questionnaires'}
      description='Create and manage questionnaires, strategy settings, metadata, and activation state.'
      actions={
        <Button type='button' onClick={openCreateDialog}>
          <Plus className='size-4' />
          Add Questionnaire
        </Button>
      }
    >
      <PaginatedDataTable
        columns={[
          { key: 'code', label: 'Code' },
          { key: 'name', label: 'Name' },
          {
            key: 'active',
            label: 'Active',
            render: (row) => (
              <Switch
                checked={getBoolean(row.isActive)}
                onChange={(checked) =>
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
                <Button
                  type='button'
                  size='icon'
                  variant='outline'
                  onClick={() => setDeleteId(String(row.id))}
                >
                  <Trash2 className='size-4' />
                </Button>
              </div>
            ),
          },
        ]}
        rows={rows}
        isLoading={questionnairesQuery.isLoading}
        isError={questionnairesQuery.isError}
        searchValue={search}
        onSearchChange={setSearch}
      />

      <Modal
        opened={showDialog}
        onClose={() => setShowDialog(false)}
        title={form.id ? 'Edit Questionnaire : ' + form.id : 'Create Questionnaire'}
        size="xl"
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Configure questionnaire metadata and conversational behavior.
          </Text>
          
          <Grid>
            <Grid.Col span={6}>
              <TextInput label="Name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput label="Code" value={form.code} onChange={(event) => setForm((current) => ({ ...current, code: event.target.value }))} />
            </Grid.Col>
          </Grid>

          <Textarea // Label is already part of Mantine Textarea
            label="Description"
            rows={4}
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
          />
          <Grid>
            <Grid.Col span={6}>
              <SelectField
                label="Processing Strategy"
                value={form.processingStrategy}
                onChange={(value) => setForm((current) => ({ ...current, processingStrategy: value }))}
                options={PROCESSING_STRATEGY_OPTIONS}
                placeholder='Select strategy'
              />
            </Grid.Col>
            <Grid.Col span={6} style={{ display: 'flex', alignItems: 'flex-end' }}>
               <Switch
                  label="Active"
                  checked={form.isActive}
                  onChange={(event) => setForm((current) => ({ ...current, isActive: event.currentTarget.checked }))}
                />
            </Grid.Col>

            <Grid.Col span={6}>
              <Switch
                label="Allow Back Navigation"
                checked={form.allowBackNavigation}
                onChange={(event) => setForm((current) => ({ ...current, allowBackNavigation: event.currentTarget.checked }))}
              />
            </Grid.Col>
            <Grid.Col span={6}>
               <Switch
                  label="Allow Multiple Sessions"
                  checked={form.allowMultipleSessions}
                  onChange={(event) => setForm((current) => ({ ...current, allowMultipleSessions: event.currentTarget.checked }))}
                />
            </Grid.Col>
          </Grid>

          <TagInput // Label is rendered inside TagInput now
            value={form.tags}
            onChange={(tags) => setForm((current) => ({ ...current, tags: tags as string[] }))}
          />

          <JsonEditorField
            label="Metadata"
            value={form.metadata}
            onChange={(metadata) =>
              setForm((current) => ({
                ...current,
                metadata: metadata as Record<string, unknown>,
              }))
            }
          />

          <QuestionnaireQuestionsManager
            questionnaireId={form.id}
            onQuestionsChange={setQuestionRows}
          />

          <Stack gap="xs" p="md" style={{ border: '1px solid var(--mantine-color-gray-3)', borderRadius: '8px' }}>
            <Text fw={500} size="sm">Sample Response JSON</Text> {/* Mantine Text as Label */}
            <Button type='button' variant='outline' onClick={() => setShowSampleJson(true)}>
              View Sample JSON
            </Button>
            <JsonEditorField value={samplePayload} onChange={() => undefined} rows={6} />
          </Stack>

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={submitForm}
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {form.id ? 'Save Changes' : 'Create Questionnaire'}
            </Button>
          </Group>
        </Stack>
      </Modal>

      <JsonPreviewDialog
        open={showSampleJson}
        onOpenChange={setShowSampleJson}
        title='Questionnaire Sample JSON'
        value={samplePayload}
      />

      <ConfirmDialog
        open={deleteId != null}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null)
        }}
        title='Delete questionnaire'
        desc='This will permanently remove the questionnaire.'
        confirmText='Delete'
        destructive
        isLoading={deleteMutation.isPending}
        handleConfirm={() => {
          if (!deleteId) return
          deleteMutation.mutate(deleteId, {
            onSuccess: () => setDeleteId(null),
          })
        }}
      />
    </RxPage>
  )
}
