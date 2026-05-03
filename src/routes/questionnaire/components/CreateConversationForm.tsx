import { Loader2, PlayCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AsyncSelectField } from '@/features/components/form/async-field'
import { SelectField } from '@/features/components/form/select'
import { conversationApi } from '@/lib/conversation-api'

import type { DisplayMode } from '../types'

type Props = {
  phone: string
  setPhone: (value: string) => void

  questionnaireId?: string
  setQuestionnaireId?: (value: string) => void

  channelId?: string
  setChannelId?: (value: string) => void

  displayMode?: DisplayMode
  setDisplayMode?: (value: DisplayMode) => void

  onSubmit: (payload: {
    phone: string
    questionnaireId?: string
    channelId?: string
    displayMode?: DisplayMode
  }) => void

  loading?: boolean

  disabled?: {
    phone?: boolean
    questionnaire?: boolean
    channel?: boolean
    displayMode?: boolean
  }
}

export function CreateConversationForm({
  phone,
  setPhone,

  questionnaireId = '',
  setQuestionnaireId = () => {},

  channelId = '',
  setChannelId = () => {},

  displayMode = 'EACH',
  setDisplayMode = () => {},

  onSubmit,
  loading,

  disabled,
}: Props) {
  const isDisabled =
    !phone.trim() ||
    !channelId ||
    !questionnaireId

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* QUESTIONNAIRE */}
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
        disabled={disabled?.questionnaire}
        onChange={setQuestionnaireId}
        apiClient={conversationApi}
      />

      {/* CHANNEL */}
      <AsyncSelectField
        value={channelId}
        field={{
          name: 'channelId',
          label: 'Channel',
          type: 'async-select',
          endpoint: '/channels',
          searchParam: 'search',
          minChars: 0,
          valueKey: 'id',
          labelKey: 'name',
          placeholder: 'Search channel',
        }}
        disabled={disabled?.channel}
        onChange={setChannelId}
        apiClient={conversationApi}
      />

      {/* PHONE */}
      <Input
        value={phone}
        disabled={disabled?.phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Participant phone"
      />

      {/* DISPLAY MODE */}
      <SelectField
        value={displayMode}
        disabled={disabled?.displayMode}
        onChange={(v) => setDisplayMode(v as DisplayMode)}
        options={[
          { value: 'ALL', label: 'ALL' },
          { value: 'EACH', label: 'EACH' },
        ]}
        placeholder="Display mode"
      />

      {/* SUBMIT */}
      <div className="md:col-span-2">
        <Button
          type="button"
          disabled={isDisabled || loading}
          onClick={() =>
            onSubmit({
              phone: phone.trim(),
              questionnaireId,
              channelId,
              displayMode,
            })
          }
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <PlayCircle className="size-4" />
          )}
          Start Conversation
        </Button>
      </div>
    </div>
  )
}