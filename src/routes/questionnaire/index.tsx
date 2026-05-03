import { useEffect, useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { Questionnaire, type QuestionnaireQuestion } from '@/features/conversation/components/questionnaire'
import { useDebouncedValue, getArrayPayload } from '@/features/components/utils'
import { conversationApi } from '@/lib/conversation-api'

import type {
  ConversationSession,
  EntryMode,
  AnswerValue,
} from './types'

import {
  stringifyAnswer,
  resolveQuestions,
  decorateConversations,
} from './utils'

import { EntryModeTabs } from './components/EntryModeTabs'
import { ParticipantSearch } from './components/ParticipantSearch'
import { ConversationLoader } from './components/ConversationLoader'
import { CreateConversationForm } from './components/CreateConversationForm'

/* ================= PAGE ================= */

function PublicQuestionnairePage() {
  const [entryMode, setEntryMode] = useState<EntryMode>('participant-phone')

  const [phoneSearch, setPhoneSearch] = useState('')
  const [selectedParticipantId, setSelectedParticipantId] = useState<string | null>('')

  const [conversationId, setConversationId] = useState('')
  const [session, setSession] = useState<ConversationSession | null>(null)
  const [questions, setQuestions] = useState<QuestionnaireQuestion[]>([])

  const [loading, setLoading] = useState(false)

  const debouncedPhone = useDebouncedValue(phoneSearch, 300)

  /* ================= QUERIES ================= */

  const participantQuery = useQuery({
    queryKey: ['participants', debouncedPhone],
    queryFn: async () => {
      const res = await conversationApi.get('/participants', {
        params: { search: debouncedPhone, attribute: 'phone' },
      })
      return getArrayPayload(res.data)
    },
    enabled: !session && debouncedPhone.length >= 3,
  })

  const conversationsQuery = useQuery({
    queryKey: ['participant-conversations', selectedParticipantId],
    queryFn: async () => {
      const res = await conversationApi.get(
        `/participants/${selectedParticipantId}/conversations`
      )
      return decorateConversations(getArrayPayload(res.data) as ConversationSession[])
    },
    enabled: !!selectedParticipantId && !session,
  })

  /* ================= HELPERS ================= */

  async function hydrateSession(next: ConversationSession) {
    const resolved = await resolveQuestions(next)
    setSession(next)
    setQuestions(resolved)
    setConversationId(next.id)
  }

  async function loadConversationById(id = conversationId) {
    if (!id) return

    setLoading(true)
    try {
      const res = await conversationApi.get(`/conversations/${id}`)
      await hydrateSession(res.data)
      toast.success('Conversation loaded')
    } catch {
      toast.error('Conversation not found')
    } finally {
      setLoading(false)
    }
  }

  async function startConversation(payload: {
    phone: string
    questionnaireId?: string
    channelId?: string
  }) {
    setLoading(true)
    try {
      const res = await conversationApi.post('/conversations', payload)
      await hydrateSession(res.data)
      toast.success('Conversation created')
    } catch {
      toast.error('Failed to create conversation')
    } finally {
      setLoading(false)
    }
  }

  /* ================= DERIVED ================= */

  const participants = getArrayPayload(participantQuery.data ?? [])
  const conversations = conversationsQuery.data ?? []

  const initialAnswers = useMemo(() => {
    return (session?.context?.answers as Record<string, AnswerValue>) ?? {}
  }, [session])

  /* ================= EFFECTS ================= */

  useEffect(() => {
    if (session) return

    const match = participants.find(
      (p) => String(p.phone) === phoneSearch
    )

    if (match) {
      setSelectedParticipantId(String(match.id))
    }
  }, [participants, phoneSearch, session])

  /* ================= UI ================= */

  return (
    <div className="p-6 space-y-6">
      {/* ENTRY MODE */}
      <EntryModeTabs value={entryMode} onChange={setEntryMode} />

      {/* MODES */}
      {entryMode === 'participant-phone' && (
        <ParticipantSearch
          phone={phoneSearch}
          setPhone={setPhoneSearch}
          participants={participants}
          loading={participantQuery.isLoading}
          selectedId={selectedParticipantId}
          onSelect={setSelectedParticipantId}
          conversations={conversations}
          onLoadConversation={loadConversationById}
        />
      )}

      {entryMode === 'conversation-id' && (
        <ConversationLoader
          value={conversationId}
          setValue={setConversationId}
          onLoad={loadConversationById}
          loading={loading}
        />
      )}

      {entryMode === 'create-new' && (
        <CreateConversationForm
          phone={phoneSearch}
          setPhone={setPhoneSearch}
          onSubmit={startConversation}
          loading={loading}
        />
      )}

      {/* QUESTIONNAIRE */}
      {session && (
        <Questionnaire
          title="User Feedback"
          description="Answer the questions"
          questions={questions}
          initialAnswers={initialAnswers}
          initialCurrentQuestionId={session.currentQuestionId}
          onProcessAnswer={async ({ answer }) => ({
            advance: true,
            answer: stringifyAnswer(answer),
          })}
          onSaveProgress={async () => {}}
          onComplete={async () => {}}
        />
      )}
    </div>
  )
}

/* ================= ROUTE ================= */

export const Route = createFileRoute('/questionnaire/')({
  component: PublicQuestionnairePage,
})