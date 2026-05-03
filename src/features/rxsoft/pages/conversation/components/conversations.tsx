import { useMemo, useState } from 'react'
import { Braces, Pencil, Plus, Trash2 } from 'lucide-react'
import { Button, Modal, TextInput, Stack, Grid, Text } from '@mantine/core'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { AsyncSelectField } from '@/features/components/form/async-field'
import { JsonEditorField } from '@/features/components/json-editor-field'
import { PaginatedDataTable } from '@/features/components/paginated-data-table'
import { RxPage } from '@/features/components/rx-page'
import { SelectField } from '@/features/components/form/select'
import { conversationApi } from '@/lib/conversation-api'
import {
  CONVERSATION_STATE_OPTIONS,
  CONVERSATION_STATUS_OPTIONS,
} from '../types/constants'
import {
  DialogActions,
  JsonPreviewDialog,
  LabelField,
  getDirtyPayload,
  getObject,
  getString,
  normalizeRows,
  useConversationCrud,
  useConversationList,
} from './shared'

type ConversationFormState = {
  id?: string
  questionnaireId: string
  questionnaireCode: string
  channelId: string
  participantId: string
  phone: string
  email: string
  currentQuestionId: string
  status: string
  state: string
  context: Record<string, unknown>
}

const defaultFormState: ConversationFormState = {
  questionnaireId: '',
  questionnaireCode: '',
  channelId: '',
  participantId: '',
  phone: '',
  email: '',
  currentQuestionId: '',
  status: 'ACTIVE',
  state: 'START',
  context: {},
}

export function RxConversationsPage() {
  const [search, setSearch] = useState('')
  const [showDialog, setShowDialog] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState<ConversationFormState>(defaultFormState)
  const [initialForm, setInitialForm] = useState<ConversationFormState>(defaultFormState)
  const [jsonPreview, setJsonPreview] = useState<Record<string, unknown> | null>(null)

  const conversationsQuery = useConversationList('/conversations', search)
  const { createMutation, updateMutation, deleteMutation } =
    useConversationCrud('/conversations')

  const rows = useMemo(
    () => normalizeRows(conversationsQuery.data ?? []),
    [conversationsQuery.data]
  )

  function openCreateDialog() {
    setForm(defaultFormState)
    setInitialForm(defaultFormState)
    setShowDialog(true)
  }

  function openEditDialog(row: Record<string, unknown>) {
    const nextForm = {
      id: String(row.id),
      questionnaireId: getString(row.questionnaireId),
      questionnaireCode: '',
      channelId: getString(row.channelId),
      participantId: getString(row.participantId),
      phone: '',
      email: '',
      currentQuestionId: getString(row.currentQuestionId),
      status: getString(row.status || 'ACTIVE'),
      state: getString(row.state || 'START'),
      context: getObject(row.context),
    }
    setForm(nextForm)
    setInitialForm(nextForm)
    setShowDialog(true)
  }

  function submitForm() {
    const payload = {
      questionnaireId: form.questionnaireId || undefined,
      questionnaireCode: form.questionnaireCode.trim() || undefined,
      channelId: form.channelId || undefined,
      participantId: form.participantId || undefined,
      phone: form.phone.trim() || undefined,
      email: form.email.trim() || undefined,
      currentQuestionId: form.currentQuestionId.trim() || undefined,
      status: form.status,
      state: form.state,
      context: form.context,
    }

    if (form.id) {
      const dirtyPayload = getDirtyPayload(
        initialForm as unknown as Record<string, unknown>,
        payload as unknown as Record<string, unknown>
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
        setForm(defaultFormState)
      },
    })
  }

  return (
    <RxPage
      title='Conversations'
      description='Create and manage conversation sessions, including participant linkage and saved context.'
      actions={
        <Button type='button' onClick={openCreateDialog}>
          <Plus className='size-4' />
          Add Conversation
        </Button>
      }
    >
      <PaginatedDataTable
        columns={[
          { key: 'id', label: 'Conversation ID' },
          { key: 'questionnaireId', label: 'Questionnaire' },
          { key: 'participantId', label: 'Participant' },
          { key: 'channelId', label: 'Channel' },
          { key: 'currentQuestionId', label: 'Current Question' },
          { key: 'status', label: 'Status' },
          { key: 'state', label: 'State' },
          {
            key: 'actions',
            label: 'Actions',
            render: (row) => (
              <div className='flex gap-2'>
                <Button
                  type='button'
                  size='icon'
                  variant='outline'
                  onClick={() => setJsonPreview(row)}
                >
                  <Braces className='size-4' />
                </Button>
                <Button
                  type='button'
                  size='icon'
                  variant='outline'
                  onClick={() => openEditDialog(row)}
                >
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
        isLoading={conversationsQuery.isLoading}
        isError={conversationsQuery.isError}
        searchValue={search}
        onSearchChange={setSearch}
      />

      <Modal
        opened={showDialog}
        onClose={() => setShowDialog(false)}
        title={form.id ? 'Edit Conversation' : 'Create Conversation'}
        size='xl'
      >
        <Stack gap='md'>
          <Text size='sm' c='dimmed'>Start a conversation with questionnaire and channel references, or adjust a saved session.</Text>
          <Grid>
            <Grid.Col span={6}>
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
                onChange={(value) => setForm((current) => ({ ...current, questionnaireId: value }))}
                apiClient={conversationApi}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label='Questionnaire Code'
                value={form.questionnaireCode}
                onChange={(event: any) =>
                  setForm((current) => ({ ...current, questionnaireCode: event.target.value }))
                }
                placeholder='Optional alternate lookup'
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <AsyncSelectField
                value={form.channelId}
                field={{
                  name: 'channelId',
                  label: 'Channel',
                  type: 'async-select',
                  endpoint: '/channels',
                  searchParam: 'search',
                  minChars: 0,
                  valueKey: 'id',
                  labelKey: 'name',
                  placeholder: 'Select channel',
                }}
                onChange={(value) => setForm((current) => ({ ...current, channelId: value }))}
                apiClient={conversationApi}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label='Participant ID'
                value={form.participantId}
                onChange={(event: any) =>
                  setForm((current) => ({ ...current, participantId: event.target.value }))
                }
                placeholder='Optional participant ID'
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label='Phone'
                value={form.phone}
                onChange={(event: any) =>
                  setForm((current) => ({ ...current, phone: event.target.value }))
                }
                placeholder='Used when creating a new participant'
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label='Email'
                value={form.email}
                onChange={(event: any) =>
                  setForm((current) => ({ ...current, email: event.target.value }))
                }
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label='Current Question ID'
                value={form.currentQuestionId}
                onChange={(event: any) =>
                  setForm((current) => ({
                    ...current,
                    currentQuestionId: event.target.value,
                  }))
                }
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <SelectField
                label='Status'
                value={form.status}
                onChange={(value) => setForm((current) => ({ ...current, status: value }))}
                options={CONVERSATION_STATUS_OPTIONS}
                placeholder='Select status'
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <SelectField
                label='State'
                value={form.state}
                onChange={(value) => setForm((current) => ({ ...current, state: value }))}
                options={CONVERSATION_STATE_OPTIONS}
                placeholder='Select state'
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <JsonEditorField
                label='Context'
                value={form.context}
                onChange={(context) =>
                  setForm((current) => ({
                    ...current,
                    context: context as Record<string, unknown>,
                  }))
                }
              />
            </Grid.Col>
          </Grid>
          <DialogActions
            submitLabel={form.id ? 'Save Changes' : 'Create Conversation'}
            loading={createMutation.isPending || updateMutation.isPending}
            onCancel={() => setShowDialog(false)}
            onSubmit={submitForm}
          />
        </Stack>
      </Modal>

      <ConfirmDialog
        open={deleteId != null}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null)
        }}
        title='Delete conversation'
        desc='This will permanently remove the selected conversation record.'
        confirmText='Delete'
        destructive
        handleConfirm={() => {
          if (deleteId) {
            deleteMutation.mutate(deleteId)
          }
          setDeleteId(null)
        }}
      />

      <JsonPreviewDialog
        open={jsonPreview != null}
        onOpenChange={(open) => {
          if (!open) setJsonPreview(null)
        }}
        title='Conversation JSON'
        value={jsonPreview}
      />
    </RxPage>
  )
}
