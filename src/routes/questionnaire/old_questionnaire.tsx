import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import {
  Check,
  MessageSquareText,
  PhoneCall,
  PlayCircle,
  Search,
} from 'lucide-react'


import { AsyncSelectField } from '@/features/components/form/async-field'
import { useDebouncedValue, getArrayPayload } from '@/features/components/utils'
import {
  Questionnaire,
  type QuestionnaireQuestion,
} from '@/features/conversation/components/questionnaire'
import { SelectField } from '@/features/components/form/select'
import { conversationApi } from '@/lib/conversation-api'
import { Badge, Button, Card, Grid, Group, Input, Loader, Modal, Stack, Tabs, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'

function PublicQuestionnairePage() {
  const [entryMode, setEntryMode] = useState<EntryMode>('participant-phone')
  const [paramConfig, setParamConfig] = useState<ParamConfig>({
    mode: '',
    displayTitle: true,
    displaySubtitle: true,
  })
  const [phoneSearch, setPhoneSearch] = useState('')
  const [selectedParticipantId, setSelectedParticipantId] = useState('')
  const [questionnaireId, setQuestionnaireId] = useState('')
  const [channelId, setChannelId] = useState('')
  const [conversationId, setConversationId] = useState('')
  const [displayMode, setDisplayMode] = useState<DisplayMode>('EACH')
  const [session, setSession] = useState<ConversationSession | null>(null)
  const [questions, setQuestions] = useState<QuestionnaireQuestion[]>([])
  const [loading, setLoading] = useState(false)
  const [showNotFoundDialog, setShowNotFoundDialog] = useState(false)
  const [bootstrapped, setBootstrapped] = useState(false)
  const debouncedPhone = useDebouncedValue(phoneSearch, 300)
  const [activeConversation, setActiveConversation] = useState<ConversationSession | null>(null)
  const [showActiveDialog, setShowActiveDialog] = useState(false)

  useEffect(() => {
    const search = new URLSearchParams(window.location.search)

    const questionnaireId = search.get('questionnaireId') ?? ''
    const questionnaireCode = questionnaireId ? '' : search.get('questionnaireCode') ?? ''
    const participantPhone = search.get('participantPhone') ?? search.get('phone') ?? ''
    const conversationId = search.get('conversationId') ?? ''
    const channelId = search.get('channelId') ?? ''
    const modeParam = search.get('mode') ?? ''

    const displayModeParam =
      (search.get('displayMode') ?? '').toLowerCase() === 'all' ? 'ALL' : 'EACH'

    const displayTitle = getBooleanParam(search.get('displayTitle'), true)
    const displaySubtitle = getBooleanParam(search.get('displaySubtitle'), true)

    // ✅ Determine mode (STRICT PRIORITY)
    let nextEntryMode: EntryMode = 'participant-phone'

    if (modeParam === 'generic') {
      nextEntryMode = 'participant-phone' // default tab
    } else if (conversationId) {
      nextEntryMode = 'conversation-id'
    } else if (
      participantPhone &&
      (questionnaireId || questionnaireCode) &&
      channelId
    ) {
      nextEntryMode = 'create-new-from-params'
    } else if (participantPhone) {
      nextEntryMode = 'participant-phone'
    } else if (questionnaireId || questionnaireCode || channelId) {
      nextEntryMode = 'create-new-from-params'
    }

    // ✅ Apply all state in one place
    setParamConfig({
      mode: modeParam,
      conversationId: conversationId || undefined,
      questionnaireId: questionnaireId || undefined,
      questionnaireCode: questionnaireCode || undefined,
      channelId: channelId || undefined,
      participantPhone: participantPhone || undefined,
      displayMode: displayModeParam,
      displayTitle,
      displaySubtitle,
    })
    setEntryMode(nextEntryMode)
    console.log('Resolved mode:', nextEntryMode)
  }, [])

  useEffect(() => {
    if (bootstrapped) return

    try {
      // ✅ MODE: conversation-id
      if (entryMode === 'conversation-id') {
        loadConversationById(paramConfig.conversationId)
        return
      }
      // ✅ MODE: create-new-from-params (AUTO FLOW)
      if (entryMode === 'create-new-from-params') {
        loadOrCreateConversation(paramConfig.participantPhone || '')
      }

      // ✅ MODE: participant-phone
      if (entryMode === 'participant-phone') {
        return
      }
    } catch (err) {
      console.error('Bootstrap error:', err)
    }


  }, [entryMode])


  async function loadOrCreateConversation(phone: string) {
    const esisting = await loadConversationByParticipantPhone(phone)
    if (esisting) {
      setActiveConversation(esisting)
      setShowActiveDialog(true)
    } else {
      startConversation(paramConfig.participantPhone!, paramConfig.questionnaireId!, paramConfig.questionnaireCode!, paramConfig.channelId!)
    }
  }

  async function loadConversationByParticipantPhone(phone: string): Promise<ConversationSession | null> {

    setLoading(true)

    try {
      // ✅ STEP 1: fetch participants (no react-query dependency)
      const participantRes = await conversationApi.get('/participants', {
        params: {
          search: phone.trim(),
          attribute: 'phone',
        },
      })

      const participants = getArrayPayload(participantRes.data)

      if (!participants.length) {
        notifications.show({ color: 'red', message: 'No participant found for this phone' })
        return null
      }

      const participantId = participants[0].id as string
      setSelectedParticipantId(participantId)

      notifications.show({
        message:
          `Found ${participants.length} ${participants.length > 1 ? 'participants' : 'participant'
          }`
      })

      // ✅ STEP 2: fetch conversations
      const conversationRes = await conversationApi.get(
        `/participants/${participantId}/conversations`
      )

      const conversations = getArrayPayload(conversationRes.data) as ConversationSession[]

      const active = conversations.find(
        (c) => String(c.status).toUpperCase() === 'ACTIVE'
      )

      // ✅ STEP 3: handle active conversation
      if (active) {
        setActiveConversation(active)
        setShowActiveDialog(true)
        return active
      } else {
        notifications.show({ message: `No active conversation found for this participant` })
        //await startConversation()
        //Show no active conversation founnd here and option to start new
      }

      return null
    } catch (error: any) {
      notifications.show({
        color: 'red', message:
          error?.response?.data?.message || 'Failed to load conversations'
      })
      return null
    } finally {
      setLoading(false)
    }
  }



  const participantQuery = useQuery({
    queryKey: ['public-questionnaire', 'participants', debouncedPhone],
    queryFn: async () => {
      const response = await conversationApi.get('/participants', {
        params: { search: debouncedPhone, attribute: 'phone' },
      })
      return getArrayPayload(response.data)
    },
    enabled: !session && debouncedPhone.trim().length >= 3,
  })

  const participantConversationsQuery = useQuery({
    queryKey: ['public-questionnaire', 'participant-conversations', selectedParticipantId],
    queryFn: async () => {
      const response = await conversationApi.get(`/participants/${selectedParticipantId}/conversations`)
      return decorateConversations(getArrayPayload(response.data) as ConversationSession[])
    },
    enabled: !session && Boolean(selectedParticipantId),
  })

  const initialAnswers = useMemo(() => {
    return (session?.context?.answers as Record<string, AnswerValue> | undefined) ?? {}
  }, [session?.context])

  async function hydrateSession(nextSession: ConversationSession, options?: { syncParticipantPhone?: boolean }) {
    const resolvedQuestions = await resolveQuestions(nextSession)
    setSession(nextSession)
    setQuestions(resolvedQuestions)
    setConversationId(nextSession.id)
    if (options?.syncParticipantPhone && nextSession.participantId) {
      try {
        const participantResponse = await conversationApi.get(`/participants/${nextSession.participantId}`)
        if (participantResponse.data?.phone) {
          setPhoneSearch(String(participantResponse.data.phone))
        }
      } catch {
        // Keep the current phone value when participant hydration fails.
      }
    }
  }

  async function startConversation(phone: string, questionnaireId: string, questionnaireCode: string, channelId: string) {
    setLoading(true)
    try {
      const response = await conversationApi.post('/conversations', {
        phone,
        questionnaireId,
        questionnaireCode,
        channelId,
        context: {
          displayMode,
        },
      })
      await hydrateSession(response.data as ConversationSession, { syncParticipantPhone: true })
      notifications.show({ message: 'Conversation created' })
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Unable to create conversation'
      notifications.show({ message })
    } finally {
      setLoading(false)
    }
  }

  async function stopConversation(conversationId: string) {
    setLoading(true)
    try {
      await conversationApi.patch(`/conversations/${conversationId}`, {
        status: 'STOPPED',
        state: 'INCOMPLETE',
        context: {
          stopped: 'MANUALLY STOPPED ON UI',
        },
      })
      notifications.show({ message: 'Active Conversation stopped' })
      setParamConfig({ mode: '', displayTitle: true, displaySubtitle: true });
      setEntryMode('create-new-from-ui')
    } catch (error: any) {
      notifications.show({ message: error?.response?.data?.message || 'Unable to create conversation' })
    } finally {
      setLoading(false)
    }
  }

  async function handleStop() {
    if (activeConversation)
      await stopConversation(activeConversation?.id)
    setShowActiveDialog(false)
  }
  async function handleStopAndCreateNew() {
    if (!activeConversation) return

    setLoading(true)
    try {
      await conversationApi.patch(`/conversations/${activeConversation.id}`, {
        status: 'STOPPED',
        state: 'INCOMPLETE',
        context: {
          stopped: 'USER_INITIATED_NEW_CONVERSATION',
        },
      })
      notifications.show({ message: 'Previous conversation stopped' })
      setShowActiveDialog(false)
      setActiveConversation(null)
      await startConversation(paramConfig.participantPhone || '', paramConfig.questionnaireId || '', paramConfig.questionnaireCode || '', paramConfig.channelId || '')
      notifications.show({ message: 'New conversation started' });
    } catch (error: any) {
      notifications.show({ message: error?.response?.data?.message || 'Failed to stop conversation', color: 'red' })
    } finally {
      setLoading(false)
    }
  }

  async function handleContinueConversation() {
    if (!activeConversation) return
    setShowActiveDialog(false)
    await hydrateSession(activeConversation, { syncParticipantPhone: true })
    notifications.show({ message: 'Resuming active conversation' })
  }

  function handleCancelDialog() {
    setShowActiveDialog(false)
    setActiveConversation(null)
    setParamConfig({ mode: '', displayTitle: true, displaySubtitle: true });
    setEntryMode('create-new-from-ui')
  }


  async function loadConversationById(targetConversationId = conversationId) {
    if (!targetConversationId) return

    setLoading(true)
    try {
      const response = await conversationApi.get(`/conversations/${targetConversationId}`)
      await hydrateSession(response.data as ConversationSession, { syncParticipantPhone: true })
      notifications.show({ message: 'Conversation loaded' })
    } catch {
      setShowNotFoundDialog(true)
    } finally {
      setLoading(false)
    }
  }

  async function loadConversationSession(nextSession: ConversationSession) {
    setConversationId(nextSession.id)
    await loadConversationById(nextSession.id)
  }

  async function saveProgress(payload: {
    answers: Record<string, AnswerValue>
    currentIndex: number
    progress: number
  }) {
    if (!session?.id) return
    const nextQuestion = questions[payload.currentIndex]
    await conversationApi.patch(`/conversations/${session.id}`, {
      currentQuestionId: nextQuestion?.id,
      context: {
        ...(session.context ?? {}),
        answers: payload.answers,
        progress: payload.progress,
        displayMode,
      },
    })
  }

  async function processAnswer(payload: {
    question: QuestionnaireQuestion
    answer: AnswerValue
    answers: Record<string, AnswerValue>
    currentIndex: number
    questions: QuestionnaireQuestion[]
  }) {
    if (!session?.id) {
      return {
        advance: true,
      }
    }

    try {
      const response = await conversationApi.post(`/conversations/${session.id}/process-response`, {
        message: stringifyAnswer(payload.answer),
      })

      const latestConversationResponse = await conversationApi.get(`/conversations/${session.id}`)
      const latestSession = latestConversationResponse.data as ConversationSession
      await hydrateSession(latestSession)

      const reason = String(response.data?.reason ?? '')
      const action = String(response.data?.action ?? '')

      if (reason === 'VALIDATION_ERROR') {
        return {
          advance: false,
          errorMessage: String(response.data?.message || 'This answer could not be processed.'),
        }
      }

      if (action === 'COMPLETED_CONVERSATION' || latestSession.status === 'COMPLETED') {
        return {
          complete: true,
        }
      }

      return {
        advance: true,
        nextQuestionId: latestSession.currentQuestionId,
        answers: payload.answers,
      }
    } catch (error: any) {
      return {
        advance: false,
        errorMessage: error?.response?.data?.message || 'Unable to process this answer right now.',
      }
    }
  }

  async function completeQuestionnaire(payload: {
    answers: Record<string, AnswerValue>
    questions: QuestionnaireQuestion[]
  }) {
    if (!session?.id) return

    const summary = buildSummaryMessage(payload.answers, payload.questions)

    await conversationApi.patch(`/conversations/${session.id}`, {
      status: 'COMPLETED',
      state: 'COMPLETED',
      endedAt: new Date().toISOString(),
      context: {
        ...(session.context ?? {}),
        answers: payload.answers,
        progress: 100,
        summary,
        displayMode,
      },
    })

    if (session.channelId && phoneSearch.trim()) {
      await conversationApi.post('/channels/send-message', {
        channelId: session.channelId,
        phone: phoneSearch.trim(),
        email: '',
        title: 'Questionnaire complete',
        previewLink: false,
        message: summary,
      })
    }
  }

  const effectiveMode =
    displayMode === 'ALL'
      ? 'vertical'
      : (session?.context?.displayMode === 'ALL' ? 'vertical' : 'horizontal')

  const participantRows = getArrayPayload(participantQuery.data ?? [])
  const conversationRows = (participantConversationsQuery.data ?? []).filter(
    (conversation) => String(conversation.status ?? '').toUpperCase() === 'ACTIVE'
  )
  const showGenericMode = paramConfig.mode === 'generic'
  const lockedMode = !showGenericMode && (
    paramConfig.conversationId
      ? 'conversation-id'
      : paramConfig.participantPhone && (paramConfig.questionnaireId || paramConfig.questionnaireCode) && paramConfig.channelId
        ? 'create-new-from-params'
        : paramConfig.participantPhone
          ? 'participant-phone'
          : paramConfig.questionnaireId || paramConfig.questionnaireCode || paramConfig.channelId
            ? 'create-new-from-params'
            : null
  )
  const isConversationIdLocked = Boolean(paramConfig.conversationId)
  const isQuestionnaireLocked = Boolean(paramConfig.questionnaireId || paramConfig.questionnaireCode)
  const isChannelLocked = Boolean(paramConfig.channelId)
  const isParticipantPhoneLocked = Boolean(paramConfig.participantPhone)
  const isDisplayModeLocked = Boolean(paramConfig.displayMode)
  const showBootstrapCard = showGenericMode || !lockedMode || !session
  const hasSession = Boolean(session?.id)


  return (
    <div className='min-h-screen overflow-y-auto bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_30%),linear-gradient(180deg,_rgba(15,23,42,0.02),_transparent)] px-4 py-10 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-6xl space-y-8'>
        <div {...({ section: 'title' } as Record<string, string>)} className='space-y-3 text-center'>
          <Badge variant='secondary' className='rounded-full px-3 py-1'>
            Public questionnaire
          </Badge>
          {paramConfig.displayTitle ? (
            <h1 className='text-4xl font-semibold tracking-tight'>Conversation Questionnaire</h1>
          ) : null}
          {paramConfig.displaySubtitle ? (
            <p className='mx-auto max-w-3xl text-sm text-muted-foreground sm:text-base'>
              Find an existing conversation by participant phone or conversation ID, or create a new
              conversation from a questionnaire and channel.
            </p>
          ) : null}
        </div>
        {showBootstrapCard ? (
          <Card shadow="xl" padding="lg" radius="lg" withBorder>
            <Stack gap="lg">

              {/* Header */}
              <div>
                <Text fw={600}>
                  Entry mode: {entryMode}
                </Text>

                <Text size="sm" c="dimmed">
                  Pick how this public session should be opened before starting the questionnaire UI.
                </Text>
              </div>

              {/* Tabs */}
              {showGenericMode ? (
             
              <Tabs
                value={entryMode}
                onChange={(value) => setEntryMode(value as EntryMode)}
              >
                <Tabs.List grow>
                  <Tabs.Tab value="participant-phone" leftSection={<PhoneCall size={14} />}>
                    Find by phone
                  </Tabs.Tab>

                  <Tabs.Tab value="conversation-id" leftSection={<MessageSquareText size={14} />}>
                    Find by conversation ID
                  </Tabs.Tab>

                  <Tabs.Tab value="create-new-from-params" leftSection={<PlayCircle size={14} />}>
                    Create new conversation
                  </Tabs.Tab>
                </Tabs.List>
              </Tabs>
              ) : null}

              {/* PHONE MODE */}
              {entryMode === 'participant-phone' ? (
                <Grid>
                  {/* Left */}
                  <Grid.Col span={{ base: 12, lg: 6 }}>
                    <Card withBorder shadow="sm" padding="md">
                      <Stack>
                        <div>
                          <Text fw={600}>Find by participant phone</Text>
                          <Text size="sm" c="dimmed">
                            Enter the participant phone number and choose a conversation.
                          </Text>
                        </div>

                        <Input
                          value={phoneSearch}
                          disabled={isParticipantPhoneLocked}
                          onChange={(e: any) => {
                            setPhoneSearch(e.target.value)
                            setSelectedParticipantId('')
                          }}
                          placeholder="Enter participant phone"
                        />

                        <Stack gap="sm">
                          {participantQuery.isLoading ? (
                            <Group gap="xs">
                              <Loader size="sm" />
                              <Text size="sm" c="dimmed">
                                Searching participants...
                              </Text>
                            </Group>
                          ) : participantRows.length > 0 ? (
                            participantRows.map((p) => (
                              <Button
                                key={String(p.id)}
                                variant="light"
                                fullWidth
                                onClick={() => setSelectedParticipantId(String(p.id))}
                                justify="space-between"
                              >
                                <div>
                                  <Text fw={500}><>{p.phone ?? 'No phone'}</></Text>
                                  <Text size="xs" c="dimmed">
                                    <>{p.email ?? 'No email'}</>
                                  </Text>
                                </div>

                                {selectedParticipantId === String(p.id) ? (
                                  <Check size={16} />
                                ) : null}
                              </Button>
                            ))
                          ) : (
                            <Text size="sm" c="dimmed">
                              Enter at least 3 digits to search participants.
                            </Text>
                          )}
                        </Stack>
                      </Stack>
                    </Card>
                  </Grid.Col>

                  {/* Right */}
                  <Grid.Col span={{ base: 12, lg: 6 }}>
                    <Card withBorder shadow="sm" padding="md">
                      <Stack>
                        <div>
                          <Text fw={600}>Participant conversations</Text>
                          <Text size="sm" c="dimmed">
                            Select a conversation to continue.
                          </Text>
                        </div>

                        {participantConversationsQuery.isLoading ? (
                          <Group gap="xs">
                            <Loader size="sm" />
                            <Text size="sm" c="dimmed">
                              Loading conversations...
                            </Text>
                          </Group>
                        ) : conversationRows.length > 0 ? (
                          conversationRows.map((c) => (
                            <Button
                              key={c.id}
                              variant="light"
                              fullWidth
                              onClick={() => loadConversationSession(c)}
                              justify="space-between"
                            >
                              <div>
                                <Text fw={500}>{c.questionnaireName}</Text>
                                <Text size="xs" c="dimmed">
                                  {c.status} ·{' '}
                                  {c.updatedAt
                                    ? new Date(c.updatedAt).toLocaleString()
                                    : 'No update time'}
                                </Text>
                              </div>

                              <Badge variant="outline">{c.state ?? 'STATE'}</Badge>
                            </Button>
                          ))
                        ) : (
                          <Text size="sm" c="dimmed">
                            Select a participant to view conversations.
                          </Text>
                        )}
                      </Stack>
                    </Card>
                  </Grid.Col>
                </Grid>
              ) : null}

              {/* CONVERSATION ID */}
              {entryMode === 'conversation-id' ? (
                <Group>
                  <Input
                    value={conversationId}
                    disabled={isConversationIdLocked}
                    onChange={(e: any) => setConversationId(e.target.value)}
                    placeholder="Enter conversation ID"
                  />

                  <Button
                    onClick={() => loadConversationById()}
                    loading={loading}
                    disabled={!conversationId || isConversationIdLocked}
                    leftSection={<Search size={16} />}
                  >
                    Load conversation
                  </Button>
                </Group>
              ) : null}

              {/* CREATE NEW */}
              {entryMode === 'create-new-from-ui' ? (
                <Grid>
                  <Grid.Col span={6}>
                    <AsyncSelectField
                      value={questionnaireId}
                      field={{
                        name: 'questionnaireId',
                        label: 'Questionnaire',
                        type: 'async-select',
                        endpoint: '/questionnaires',
                        searchParam: 'search',
                        minChars: 3,
                        valueKey: 'id',
                        labelKey: 'name',
                        placeholder: 'Search questionnaire',
                      }}
                      disabled={isQuestionnaireLocked}
                      onChange={setQuestionnaireId}
                      apiClient={conversationApi}
                    />
                  </Grid.Col>

                  <Grid.Col span={6}>
                    <AsyncSelectField
                      value={channelId}
                      field={{
                        name: 'channelId',
                        label: 'Channel',
                        type: 'async-select',
                        endpoint: '/channels',
                        searchParam: 'search',
                        minChars: 3,
                        valueKey: 'id',
                        labelKey: 'name',
                        placeholder: 'Search channel',
                      }}
                      disabled={isChannelLocked}
                      onChange={setChannelId}
                      apiClient={conversationApi}
                    />
                  </Grid.Col>

                  <Grid.Col span={6}>
                    <AsyncSelectField
                      value={displayMode}
                      field={{
                        name: 'participantId',
                        label: 'Participant',
                        type: 'async-select',
                        endpoint: '/participants',
                        searchParam: 'search',
                        minChars: 0,
                        valueKey: 'id',
                        labelKey: 'phone',
                        placeholder: 'Enter phone',
                      }}
                      onChange={setSelectedParticipantId}
                      apiClient={conversationApi}
                    />
                  </Grid.Col>

                  <Grid.Col span={6}>
                    <Button
                      fullWidth
                      onClick={() => loadConversationByParticipantPhone(phoneSearch)}
                      loading={loading}
                    >
                      Create New Conversation
                    </Button>
                  </Grid.Col>
                </Grid>
              ) : null}

              {/* SAMPLE */}
              {showGenericMode ? (
                <Button
                  variant="light"
                  onClick={() =>
                    setSession({
                      id: 'sample-conversation',
                      status: 'ACTIVE',
                      state: 'WAITING_FOR_USER',
                      context: { displayMode: 'EACH' },
                    })
                  }
                >
                  Try Sample Questions
                </Button>
              ) : null}

            </Stack>
          </Card>
        ) : null}

        {activeConversation && (<Button onClick={() => stopConversation(activeConversation.id)}>
          Stop conversation
        </Button>)}
        {session ? (
          <Questionnaire
            title='User Experience Feedback'
            description='Answer the questions one at a time. The backend processes each answer before the next step is unlocked.'
            showTitle={paramConfig.displayTitle}
            showDescription={paramConfig.displaySubtitle}

            questions={questions}
            initialAnswers={initialAnswers}
            initialCurrentQuestionId={session.currentQuestionId}
            initialMode={effectiveMode}
            onSaveProgress={saveProgress}
            onProcessAnswer={processAnswer}
            onComplete={completeQuestionnaire}
          />
        ) : null}
      </div>


      <Modal
        opened={showActiveDialog}
        onClose={() => setShowActiveDialog(false)}
        title="Active conversation found"
        size="md"
        centered
      >
        <Text size="sm" c="dimmed">
          This participant already has an active conversation. What would you like to do?
        </Text>

        <Stack mt="md" gap="sm">
          <Button onClick={handleContinueConversation}>
            Continue existing conversation
          </Button>

          <Button color="red" onClick={handleStopAndCreateNew}>
            Stop & start new conversation
          </Button>

          <Button color="red" variant="light" onClick={handleStop}>
            Only Stop conversation
          </Button>

          <Button variant="outline" onClick={handleCancelDialog}>
            Cancel
          </Button>
        </Stack>
      </Modal>


      <Modal
        opened={showNotFoundDialog}
        onClose={() => setShowNotFoundDialog(false)}
        title="Conversation not found"
        size="md"
        centered
      >
        <Text size="sm" c="dimmed">
          No conversation matched the provided conversation ID. Check the value and try again.
        </Text>
      </Modal>
    </div>
  )
}

export const Route = createFileRoute('/questionnaire/old_questionnaire')({
  component: PublicQuestionnairePage,
})


type ConversationSession = {
  id: string
  questionnaireId?: string
  channelId?: string
  participantId?: string
  currentQuestionId?: string
  status?: string
  state?: string
  updatedAt?: string
  context?: Record<string, unknown>
  questions?: QuestionnaireQuestion[]
}

type EntryMode = 'participant-phone' | 'conversation-id' | 'create-new-from-params' | 'create-new-from-ui'
type DisplayMode = 'ALL' | 'EACH'
type AnswerValue = string | string[] | number | boolean | null
type ParamConfig = {
  mode: string
  conversationId?: string
  questionnaireId?: string
  questionnaireCode?: string
  channelId?: string
  participantPhone?: string
  displayMode?: DisplayMode
  displayTitle: boolean
  displaySubtitle: boolean
}

function getBooleanParam(value: string | null, fallback = true) {
  if (value == null) return fallback
  return ['1', 'true', 'yes'].includes(value.toLowerCase())
}

function stringifyAnswer(value: AnswerValue) {
  if (Array.isArray(value)) return value.join(', ')
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (value == null) return ''
  return String(value)
}

async function resolveQuestions(session: ConversationSession) {
  if (Array.isArray(session.questions) && session.questions.length > 0) {
    return session.questions
  }

  if (!session.questionnaireId) {
    return []
  }

  const response = await conversationApi.get('/questions', {
    params: { questionnaireId: session.questionnaireId },
  })

  return getArrayPayload(response.data) as QuestionnaireQuestion[]
}

async function decorateConversations(items: ConversationSession[]) {
  const questionnaireIds = [...new Set(items.map((item) => item.questionnaireId).filter(Boolean))]
  const questionnaireEntries = await Promise.all(
    questionnaireIds.map(async (questionnaireId) => {
      try {
        const response = await conversationApi.get(`/questionnaires/${questionnaireId}`)
        return [questionnaireId, response.data?.name ?? questionnaireId] as const
      } catch {
        return [questionnaireId, questionnaireId] as const
      }
    })
  )

  const questionnaireNameMap = new Map(questionnaireEntries)
  return items.map((item) => ({
    ...item,
    questionnaireName: item.questionnaireId
      ? questionnaireNameMap.get(item.questionnaireId) ?? item.questionnaireId
      : 'Questionnaire',
  }))
}





function buildSummaryMessage(
  answers: Record<string, AnswerValue>,
  questions: QuestionnaireQuestion[]
) {
  return questions
    .map((question, index) => {
      const key = question.attribute || question.id || `question-${index}`
      const value = answers[key]
      const rendered = Array.isArray(value)
        ? value.join(', ')
        : typeof value === 'boolean'
          ? value ? 'Yes' : 'No'
          : value == null || value === ''
            ? 'Not answered'
            : String(value)
      return `${question.text}: ${rendered}`
    })
    .join('\n')
}
