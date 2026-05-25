import { codingConceptApi } from "@/lib/coding-concept-api"
import { communicationApi } from "@/lib/communication-api"
import { conversationApi } from "@/lib/conversation-api"
import { lisApi } from "@/lib/lis-api"
import { rxsoftApi } from "@/lib/rxsoft-api"
import { AxiosInstance } from "axios"

export type ModuleId =
  | 'conversation'
  | 'communication'
  | 'coding-concept'
  | 'lis'
  | 'rxsoft'
  | 'admin'

export type ModuleDefinition = {
  id: ModuleId
  title: string
  description: string
  root: string
  apiProvider: AxiosInstance
}

export const modules: ModuleDefinition[] = [
  {
    id: 'conversation',
    title: 'Conversation',
    description: 'Conversation workspace with lists, inspectors, and chat operations.',
    root: '/conversations',
    apiProvider: conversationApi
  },
  {
    id: 'communication',
    title: 'Switch',
    description: 'Switch backend module for messaging, notifications, and channel routing.',
    root: '/messages',
    apiProvider: communicationApi
  },
  {
    id: 'coding-concept',
    title: 'Coding Concept',
    description:
      'Standard terminology workspace for concept codes, metadata values, mappings, and validation lookups.',
    root: '/coding-concepts',
    apiProvider: codingConceptApi
  },
  {
    id: 'rxsoft',
    title: 'RxSoft',
    description: 'RxSoft pharmacy admin module with reporting, catalog, and operations.',
    root: '/',
    apiProvider: rxsoftApi
  },
  {
    id: 'lis',
    title: 'LIS',
    description: 'Laboratory Information System workspace backed by the standalone LIS service.',
    root: '/lis',
    apiProvider: lisApi
  },
  {
    id: 'admin',
    title: 'Admin Console',
    description: 'Full shadcn-admin workspace with the normal menu and shared controls.',
    root: '/',
    apiProvider: rxsoftApi
  },
]

export const moduleMap: Record<ModuleId, ModuleDefinition> = {
  conversation: modules[0],
  communication: modules[1],
  'coding-concept': modules[2],
  rxsoft: modules[3],
  lis: modules[4],
  admin: modules[5],
}

export const defaultModule: ModuleId = 'rxsoft'

export function getModuleRoot(moduleId: ModuleId) {
  return moduleMap[moduleId]?.root ?? '/'
}
