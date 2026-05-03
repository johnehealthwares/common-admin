import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Braces, MessageSquareMore, Pencil, Plus, Trash2 } from 'lucide-react'
import { Button, Modal, TextInput, Stack, Grid, Text } from '@mantine/core'
import { JsonEditorField } from '@/features/components/json-editor-field'
import { PaginatedDataTable } from '@/features/components/paginated-data-table'
import { RxPage } from '@/features/components/rx-page'
import { conversationApi } from '@/lib/conversation-api'
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
import { ConfirmDialog } from '@/components/confirm-dialog'

type ParticipantFormState = {
  id?: string
  firstName: string
  lastName: string
  phone: string
  email: string
  metadata: Record<string, unknown>
}

const defaultFormState: ParticipantFormState = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  metadata: {},
}

export function RxParticipantsPage() {
  const [search, setSearch] = useState('')
  const [showDialog, setShowDialog] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState<ParticipantFormState>(defaultFormState)
  const [initialForm, setInitialForm] = useState<ParticipantFormState>(defaultFormState)
  const [selectedParticipantId, setSelectedParticipantId] = useState<string>('')
  const [jsonPreview, setJsonPreview] = useState<Record<string, unknown> | null>(null)

  const participantsQuery = useConversationList('/participants', search)
  const { createMutation, updateMutation, deleteMutation } = useConversationCrud('/participants')

  const participantRows = useMemo(
    () => normalizeRows(participantsQuery.data ?? []),
    [participantsQuery.data]
  )

  const conversationsQuery = useQuery({
    queryKey: ['conversation-engine', 'participant-conversations', selectedParticipantId],
    queryFn: async () => {
      const response = await conversationApi.get(`/participants/${selectedParticipantId}/conversations`)
      const payload = response.data
      if (Array.isArray(payload)) return payload
      if (Array.isArray(payload?.data)) return payload.data
      return []
    },
    enabled: Boolean(selectedParticipantId),
  })

  const conversationRows = useMemo(
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
      firstName: getString(row.firstName),
      lastName: getString(row.lastName),
      phone: getString(row.phone),
      email: getString(row.email),
      metadata: getObject(row.metadata),
    }
    setForm(nextForm)
    setInitialForm(nextForm)
    setShowDialog(true)
  }

  function submitForm() {
    const payload = {
      firstName: form.firstName.trim() || undefined,
      lastName: form.lastName.trim() || undefined,
      phone: form.phone.trim() || undefined,
      email: form.email.trim() || undefined,
      metadata: form.metadata,
    }

    if (form.id) {
      updateMutation.mutate(
        {
          id: form.id,
          payload: getDirtyPayload(
            initialForm as unknown as Record<string, unknown>,
            payload as unknown as Record<string, unknown>
          ),
        },
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
      title='Participants'
      description='Create participants, search by phone or email, and inspect every conversation linked to a participant.'
      actions={
        <Button type='button' onClick={openCreateDialog}>
          <Plus className='size-4' />
          Add Participant
        </Button>
      }
    >
      <div className='space-y-6'>
        <PaginatedDataTable
          columns={[
            { key: 'firstName', label: 'First Name' },
            { key: 'lastName', label: 'Last Name' },
            { key: 'phone', label: 'Phone' },
            { key: 'email', label: 'Email' },
            {
              key: 'actions',
              label: 'Actions',
              render: (row) => (
                <div className='flex gap-2'>
                  <Button
                    type='button'
                    size='icon'
                    variant='outline'
                    onClick={() => setSelectedParticipantId(String(row.id))}
                  >
                    <MessageSquareMore className='size-4' />
                  </Button>
                  <Button type='button' size='icon' variant='outline' onClick={() => setJsonPreview(row)}>
                    <Braces className='size-4' />
                  </Button>
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
          rows={participantRows}
          isLoading={participantsQuery.isLoading}
          isError={participantsQuery.isError}
          searchValue={search}
          onSearchChange={setSearch}
        />

        <PaginatedDataTable
          columns={[
            { key: 'questionnaireId', label: 'Questionnaire' },
            { key: 'status', label: 'Status' },
            { key: 'state', label: 'State' },
            { key: 'currentQuestionId', label: 'Current Question' },
            { key: 'updatedAt', label: 'Updated At' },
          ]}
          rows={conversationRows}
          isLoading={conversationsQuery.isLoading}
          isError={conversationsQuery.isError}
          searchValue=''
          onSearchChange={() => undefined}
        />
      </div>

      <Modal
        opened={showDialog}
        onClose={() => setShowDialog(false)}
        title={form.id ? 'Edit Participant' : 'Create Participant'}
        size='lg'
      >
        <Stack gap='md'>
          <Text size='sm' c='dimmed'>Participant records support phone or email lookup for public questionnaire entry.</Text>
          <Grid>
            <Grid.Col span={6}>
              <TextInput label='First Name' value={form.firstName} onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))} />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput label='Last Name' value={form.lastName} onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))} />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput label='Phone' value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput label='Email' value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
            </Grid.Col>
            <Grid.Col span={12}>
              <JsonEditorField
                label='Metadata'
                value={form.metadata}
                onChange={(metadata) =>
                  setForm((current) => ({ ...current, metadata: metadata as Record<string, unknown> }))
                }
              />
            </Grid.Col>
          </Grid>
          <DialogActions
            submitLabel={form.id ? 'Save Changes' : 'Create Participant'}
            loading={createMutation.isPending || updateMutation.isPending}
            onCancel={() => setShowDialog(false)}
            onSubmit={submitForm}
          />
        </Stack>
      </Modal>

      <ConfirmDialog
        open={deleteId != null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title='Delete participant'
        desc='This will remove the selected participant record.'
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

      <JsonPreviewDialog
        open={jsonPreview != null}
        onOpenChange={(open) => {
          if (!open) setJsonPreview(null)
        }}
        title='Participant JSON'
        value={jsonPreview}
      />
    </RxPage>
  )
}
