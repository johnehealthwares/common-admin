// types.ts

import type { QuestionnaireQuestion } from '@/features/conversation/components/questionnaire'

export type ConversationSession = {
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

export type EntryMode =
  | 'participant-phone'
  | 'conversation-id'
  | 'create-new'

export type DisplayMode = 'ALL' | 'EACH'

export type AnswerValue =
  | string
  | string[]
  | number
  | boolean
  | null

export type ParamConfig = {
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