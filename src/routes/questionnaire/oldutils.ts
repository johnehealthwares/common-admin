import { QuestionnaireQuestion } from "@/features/conversation/components/questionnaire"
import { conversationApi } from "@/lib/conversation-api"



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

type EntryMode = 'participant-phone' | 'conversation-id' | 'create-new'
type DisplayMode = 'ALL' | 'EACH'
export type AnswerValue = string | string[] | number | boolean | null
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

export function getBooleanParam(value: string | null, fallback = true) {
  if (value == null) return fallback
  return ['1', 'true', 'yes'].includes(value.toLowerCase())
}

export function stringifyAnswer(value: AnswerValue) {
  if (Array.isArray(value)) return value.join(', ')
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (value == null) return ''
  return String(value)
}

export function buildSummaryMessage(
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

export async function resolveQuestions(session: ConversationSession) {
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

export async function decorateConversations(items: ConversationSession[]) {
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



  export async function processAnswer(session: any, payload: {
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

 