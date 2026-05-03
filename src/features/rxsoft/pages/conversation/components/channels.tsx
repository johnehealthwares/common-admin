import { useMemo, useState } from 'react'
import { Pencil, Plus, Send, Trash2, Upload, Webhook } from 'lucide-react'

import { ConfirmDialog } from '@/components/confirm-dialog'
import { JsonEditorField } from '@/features/components/json-editor-field'
import { PaginatedDataTable } from '@/features/components/paginated-data-table'
import { RxPage } from '@/features/components/rx-page'
import { SelectField } from '@/features/components/form/select'
import { rxsoftApi } from '@/lib/rxsoft-api'
import { CHANNEL_TYPE_OPTIONS } from '../types/constants'
import {
  DialogActions,
  LabelField,
  getObject,
  getString,
  normalizeRows,
  useConversationCrud,
  useConversationList,
} from './shared'
import { Button, Input, Modal, SimpleGrid, Switch, Text } from '@mantine/core'

type ChannelFormState = {
  id?: string
  name: string
  type: string
  provider: string
  externalId: string
  metadata: Record<string, unknown>
  isActive: boolean
}

const defaultFormState: ChannelFormState = {
  name: '',
  type: 'MOCK',
  provider: '',
  externalId: '',
  metadata: {},
  isActive: true,
}

type SendMessageState = {
  channelId: string
  title: string
  message: string
  phone: string
  email: string
  previewLink: boolean
}

type SendMediaState = {
  channelId: string
  title: string
  message: string
  phone: string
  email: string
  documentType: string
  fileUrl: string
  fileName: string
}

type MockWebhookState = {
  channelId: string
  from: string
  text: string
  questionnaireCode: string
  messageId: string
}

export function RxChannelsPage() {
  const [search, setSearch] = useState('')
  const [showCrudDialog, setShowCrudDialog] = useState(false)
  const [showSendMessage, setShowSendMessage] = useState(false)
  const [showSendMedia, setShowSendMedia] = useState(false)
  const [showMockWebhook, setShowMockWebhook] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState<ChannelFormState>(defaultFormState)
  const [sendMessageState, setSendMessageState] = useState<SendMessageState>({
    channelId: '',
    title: '',
    message: '',
    phone: '',
    email: '',
    previewLink: false,
  })
  const [sendMediaState, setSendMediaState] = useState<SendMediaState>({
    channelId: '',
    title: '',
    message: '',
    phone: '',
    email: '',
    documentType: 'document',
    fileUrl: '',
    fileName: '',
  })
  const [mockWebhookState, setMockWebhookState] = useState<MockWebhookState>({
    channelId: '',
    from: '',
    text: '',
    questionnaireCode: '',
    messageId: '',
  })

  const channelsQuery = useConversationList('/channels', search)
  const { createMutation, updateMutation, deleteMutation } =
    useConversationCrud('/channels')

  const rows = useMemo(
    () => normalizeRows(channelsQuery.data ?? []),
    [channelsQuery.data],
  )

  function openEditDialog(row: Record<string, unknown>) {
    setForm({
      id: String(row.id),
      name: getString(row.name),
      type: getString(row.type || 'MOCK'),
      provider: getString(row.provider),
      externalId: getString(row.externalId),
      metadata: getObject(row.metadata),
      isActive: Boolean(row.isActive),
    })
    setShowCrudDialog(true)
  }

  function submitCrudForm() {
    const payload = {
      name: form.name.trim(),
      type: form.type,
      provider: form.provider.trim() || undefined,
      externalId: form.externalId.trim() || undefined,
      metadata: form.metadata,
      isActive: form.isActive,
    }

    if (form.id) {
      updateMutation.mutate({ id: form.id, payload }, { onSuccess: () => setShowCrudDialog(false) })
      return
    }

    createMutation.mutate(payload, {
      onSuccess: () => {
        setShowCrudDialog(false)
        setForm(defaultFormState)
      },
    })
  }

  async function submitSendMessage() {
    await rxsoftApi.post('/channels/send-message', sendMessageState)
    setShowSendMessage(false)
  }

  async function submitSendMedia() {
    await rxsoftApi.post('/channels/send-media', sendMediaState)
    setShowSendMedia(false)
  }

  async function submitMockWebhook() {
    await rxsoftApi.post('/webhooks/mock', mockWebhookState)
    setShowMockWebhook(false)
  }

  return (
    <RxPage
      title='Channels'
      description='Manage channels and trigger operational actions like direct messages, media dispatch, and webhook simulation.'
      actions={
        <>
          <Button type='button' variant='outline' onClick={() => setShowSendMessage(true)}>
            <Send className='size-4' />
            Send Message
          </Button>
          <Button type='button' variant='outline' onClick={() => setShowSendMedia(true)}>
            <Upload className='size-4' />
            Send Media
          </Button>
          <Button type='button' variant='outline' onClick={() => setShowMockWebhook(true)}>
            <Webhook className='size-4' />
            Mock Webhook
          </Button>
          <Button type='button' onClick={() => {
            setForm(defaultFormState)
            setShowCrudDialog(true)
          }}>
            <Plus className='size-4' />
            Add Channel
          </Button>
        </>
      }
    >
      <PaginatedDataTable
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'type', label: 'Type' },
          { key: 'provider', label: 'Provider' },
          { key: 'externalId', label: 'External ID' },
          {
            key: 'active',
            label: 'Active',
            render: (row) => (
              <Switch
                checked={Boolean(row.isActive)}
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
                <Button type='button' size='icon' variant='outline' onClick={() => setDeleteId(String(row.id))}>
                  <Trash2 className='size-4' />
                </Button>
              </div>
            ),
          },
        ]}
        rows={rows}
        isLoading={channelsQuery.isLoading}
        isError={channelsQuery.isError}
        searchValue={search}
        onSearchChange={setSearch}
      />


<Modal
  opened={showCrudDialog}
  onClose={() => setShowCrudDialog(false)}
  title={form.id ? 'Edit Channel' : 'Create Channel'}
  size="xl"
  centered
>
  <Text size="sm" c="dimmed" mb="md">
    Configure a delivery channel and its metadata.
  </Text>

  <SimpleGrid cols={2} spacing="md">
    <LabelField label="Name">
      <Input
        value={form.name}
        onChange={(event) =>
          setForm((current) => ({
            ...current,
            name: event.target.value,
          }))
        }
      />
    </LabelField>

    <LabelField label="Type">
      <SelectField
        value={form.type}
        onChange={(value) =>
          setForm((current) => ({ ...current, type: value }))
        }
        options={CHANNEL_TYPE_OPTIONS}
        placeholder="Select type"
      />
    </LabelField>

    <LabelField label="Provider">
      <Input
        value={form.provider}
        onChange={(event) =>
          setForm((current) => ({
            ...current,
            provider: event.target.value,
          }))
        }
      />
    </LabelField>

    <LabelField label="External ID">
      <Input
        value={form.externalId}
        onChange={(event) =>
          setForm((current) => ({
            ...current,
            externalId: event.target.value,
          }))
        }
      />
    </LabelField>

    <LabelField label="Status">
      <div className="flex h-9 items-center gap-3 rounded-md border px-3">
        <Switch
          checked={form.isActive}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              isActive: event.currentTarget.checked,
            }))
          }
        />
        <Text size="sm" c="dimmed">
          Active
        </Text>
      </div>
    </LabelField>

    <div style={{ gridColumn: 'span 2' }}>
      <LabelField label="Metadata">
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
  </SimpleGrid>

  <div className="mt-6 flex justify-end gap-2">
    <Button variant="outline" onClick={() => setShowCrudDialog(false)}>
      Cancel
    </Button>
    <Button
      loading={createMutation.isPending || updateMutation.isPending}
      onClick={submitCrudForm}
    >
      {form.id ? 'Save Changes' : 'Create Channel'}
    </Button>
  </div>
</Modal>


<Modal
  opened={showSendMessage}
  onClose={() => setShowSendMessage(false)}
  title="Send Message"
  size="lg"
  centered
>
  <Text size="sm" c="dimmed" mb="md">
    Dispatch a direct channel message.
  </Text>

  <SimpleGrid cols={2} spacing="md">
    <LabelField label="Channel">
      <SelectField
        value={sendMessageState.channelId}
        onChange={(value) =>
          setSendMessageState((current) => ({
            ...current,
            channelId: value,
          }))
        }
        options={rows.map((row) => ({
          value: String(row.id),
          label: String(row.name),
        }))}
        placeholder="Select channel"
      />
    </LabelField>

    <LabelField label="Title">
      <Input
        value={sendMessageState.title}
        onChange={(event) =>
          setSendMessageState((current) => ({
            ...current,
            title: event.target.value,
          }))
        }
      />
    </LabelField>

    <LabelField label="Phone">
      <Input
        value={sendMessageState.phone}
        onChange={(event) =>
          setSendMessageState((current) => ({
            ...current,
            phone: event.target.value,
          }))
        }
      />
    </LabelField>

    <LabelField label="Email">
      <Input
        value={sendMessageState.email}
        onChange={(event) =>
          setSendMessageState((current) => ({
            ...current,
            email: event.target.value,
          }))
        }
      />
    </LabelField>

    <div style={{ gridColumn: 'span 2' }}>
      <LabelField label="Message">
        <Input
          value={sendMessageState.message}
          onChange={(event) =>
            setSendMessageState((current) => ({
              ...current,
              message: event.target.value,
            }))
          }
        />
      </LabelField>
    </div>

    <LabelField label="Preview Links">
      <div className="flex h-9 items-center gap-3 rounded-md border px-3">
        <Switch
          checked={sendMessageState.previewLink}
          onChange={(event) =>
            setSendMessageState((current) => ({
              ...current,
              previewLink: event.currentTarget.checked,
            }))
          }
        />
      </div>
    </LabelField>
  </SimpleGrid>

  <div className="mt-6 flex justify-end gap-2">
    <Button variant="outline" onClick={() => setShowSendMessage(false)}>
      Cancel
    </Button>
    <Button onClick={submitSendMessage}>
      Send Message
    </Button>
  </div>
</Modal>


<Modal
  opened={showSendMedia}
  onClose={() => setShowSendMedia(false)}
  title="Send Media"
  size="lg"
  centered
>
  <Text size="sm" c="dimmed" mb="md">
    Dispatch channel media using URL-based payloads.
  </Text>

  <SimpleGrid cols={2} spacing="md">
    <LabelField label="Channel">
      <SelectField
        value={sendMediaState.channelId}
        onChange={(value) =>
          setSendMediaState((current) => ({
            ...current,
            channelId: value,
          }))
        }
        options={rows.map((row) => ({
          value: String(row.id),
          label: String(row.name),
        }))}
        placeholder="Select channel"
      />
    </LabelField>

    <LabelField label="Document Type">
      <SelectField
        value={sendMediaState.documentType}
        onChange={(value) =>
          setSendMediaState((current) => ({
            ...current,
            documentType: value,
          }))
        }
        options={['document', 'image', 'video', 'audio'].map((v) => ({
          value: v,
          label: v,
        }))}
        placeholder="Select media type"
      />
    </LabelField>

    <LabelField label="Title">
      <Input
        value={sendMediaState.title}
        onChange={(event) =>
          setSendMediaState((current) => ({
            ...current,
            title: event.target.value,
          }))
        }
      />
    </LabelField>

    <LabelField label="File Name">
      <Input
        value={sendMediaState.fileName}
        onChange={(event) =>
          setSendMediaState((current) => ({
            ...current,
            fileName: event.target.value,
          }))
        }
      />
    </LabelField>

    <LabelField label="Phone">
      <Input
        value={sendMediaState.phone}
        onChange={(event) =>
          setSendMediaState((current) => ({
            ...current,
            phone: event.target.value,
          }))
        }
      />
    </LabelField>

    <LabelField label="Email">
      <Input
        value={sendMediaState.email}
        onChange={(event) =>
          setSendMediaState((current) => ({
            ...current,
            email: event.target.value,
          }))
        }
      />
    </LabelField>

    <div style={{ gridColumn: 'span 2' }}>
      <LabelField label="File URL">
        <Input
          value={sendMediaState.fileUrl}
          onChange={(event) =>
            setSendMediaState((current) => ({
              ...current,
              fileUrl: event.target.value,
            }))
          }
        />
      </LabelField>
    </div>

    <div style={{ gridColumn: 'span 2' }}>
      <LabelField label="Message">
        <Input
          value={sendMediaState.message}
          onChange={(event) =>
            setSendMediaState((current) => ({
              ...current,
              message: event.target.value,
            }))
          }
        />
      </LabelField>
    </div>
  </SimpleGrid>

  <div className="mt-6 flex justify-end gap-2">
    <Button variant="outline" onClick={() => setShowSendMedia(false)}>
      Cancel
    </Button>
    <Button onClick={submitSendMedia}>
      Send Media
    </Button>
  </div>
</Modal>


<Modal
  opened={showMockWebhook}
  onClose={() => setShowMockWebhook(false)}
  title="Mock Webhook"
  size="lg"
  centered
>
  <Text size="sm" c="dimmed" mb="md">
    Simulate an inbound webhook event using JSON-like structured inputs.
  </Text>

  <SimpleGrid cols={2} spacing="md">
    <LabelField label="Channel">
      <SelectField
        value={mockWebhookState.channelId}
        onChange={(value) =>
          setMockWebhookState((current) => ({
            ...current,
            channelId: value,
          }))
        }
        options={rows.map((row) => ({
          value: String(row.id),
          label: String(row.name),
        }))}
        placeholder="Select channel"
      />
    </LabelField>

    <LabelField label="From">
      <Input
        value={mockWebhookState.from}
        onChange={(event) =>
          setMockWebhookState((current) => ({
            ...current,
            from: event.target.value,
          }))
        }
      />
    </LabelField>

    <div style={{ gridColumn: 'span 2' }}>
      <LabelField label="Text">
        <Input
          value={mockWebhookState.text}
          onChange={(event) =>
            setMockWebhookState((current) => ({
              ...current,
              text: event.target.value,
            }))
          }
        />
      </LabelField>
    </div>

    <LabelField label="Questionnaire Code">
      <Input
        value={mockWebhookState.questionnaireCode}
        onChange={(event) =>
          setMockWebhookState((current) => ({
            ...current,
            questionnaireCode: event.target.value,
          }))
        }
      />
    </LabelField>

    <LabelField label="Message ID">
      <Input
        value={mockWebhookState.messageId}
        onChange={(event) =>
          setMockWebhookState((current) => ({
            ...current,
            messageId: event.target.value,
          }))
        }
      />
    </LabelField>
  </SimpleGrid>

  <div className="mt-6 flex justify-end gap-2">
    <Button variant="outline" onClick={() => setShowMockWebhook(false)}>
      Cancel
    </Button>
    <Button onClick={submitMockWebhook}>
      Send Mock Webhook
    </Button>
  </div>
</Modal>

      <ConfirmDialog
        open={deleteId != null}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null)
        }}
        title='Delete channel'
        desc='This will permanently remove the selected channel.'
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
