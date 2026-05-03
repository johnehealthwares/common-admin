export type ModuleId =
  | 'conversation'
  | 'communication'
  | 'coding-concept'
  | 'rxsoft'
  | 'admin'

export type ModuleDefinition = {
  id: ModuleId
  title: string
  description: string
  root: string
}

export const modules: ModuleDefinition[] = [
  {
    id: 'conversation',
    title: 'Conversation',
    description: 'Conversation workspace with lists, inspectors, and chat operations.',
    root: '/conversations',
  },
  {
    id: 'communication',
    title: 'Switch',
    description: 'Switch backend module for messaging, notifications, and channel routing.',
    root: '/messages',
  },
  {
    id: 'coding-concept',
    title: 'Coding Concept',
    description:
      'Standard terminology workspace for concept codes, metadata values, mappings, and validation lookups.',
    root: '/coding-concepts',
  },
  {
    id: 'rxsoft',
    title: 'RxSoft',
    description: 'RxSoft pharmacy admin module with reporting, catalog, and operations.',
    root: '/',
  },
  {
    id: 'admin',
    title: 'Admin Console',
    description: 'Full shadcn-admin workspace with the normal menu and shared controls.',
    root: '/',
  },
]

export const moduleMap: Record<ModuleId, ModuleDefinition> = {
  conversation: modules[0],
  communication: modules[1],
  'coding-concept': modules[2],
  rxsoft: modules[3],
  admin: modules[4],
}

export const defaultModule: ModuleId = 'rxsoft'

export function getModuleRoot(moduleId: ModuleId) {
  return moduleMap[moduleId]?.root ?? '/'
}
