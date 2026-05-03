/**
 * Conversation Module
 * Conversation workspace features including chats, conversations, questionnaires, and workflows.
 */

// Re-export conversation features
export * from '@/features/chats'
export * from '@/features/rxsoft/pages/conversation'

// Module metadata
export const conversationModuleId = 'conversation' as const
export const conversationModuleName = 'Conversation Workspace'
export const conversationModuleDescription = 'Lists, inspectors, and chat operations for conversation workflows'
