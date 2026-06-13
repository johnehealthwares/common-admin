import { AxiosInstance } from 'axios';
import { codingConceptApi } from '@/lib/coding-concept-api';
import { communicationApi } from '@/lib/communication-api';
import { conversationApi } from '@/lib/conversation-api';
import { lisApi } from '@/lib/lis-api';
import { rxsoftApi } from '@/lib/rxsoft-api';

export type ModuleId =
  | 'conversation'
  | 'communication'
  | 'coding-concept'
  | 'lis'
  | 'rxsoft'
  | 'admin';

export type ModuleDefinition = {
  id: ModuleId;
  title: string;
  description: string;
  root: string;
  apiProvider: AxiosInstance;
  routes: string[];
  resources: string[];
};

export const modules: ModuleDefinition[] = [
  {
    id: 'conversation',
    title: 'Conversation',
    description: 'Conversation workspace with lists, inspectors, and chat operations.',
    root: '/conversations',
    apiProvider: conversationApi,
    routes: [
      '/conversations',
      '/participants',
      '/questionnaires',
      '/questions',
      '/workflows',
      '/workflow-configuration',
      '/workflow-instances',
      '/workflow-events',
      '/channels',
      '/exchanges',
    ],
    resources: [
      'conversations',
      'participants',
      'questionnaires',
      'questions',
      'workflows',
      'channels',
      'exchanges',
    ],
  },
  {
    id: 'communication',
    title: 'Switch',
    description: 'Switch backend module for messaging, notifications, and channel routing.',
    root: '/messages',
    apiProvider: communicationApi,
    routes: [
      '/aes',
      '/messages',
      '/notifications',
      '/notification-templates',
      '/message-templates',
      '/communication-channels',
      '/message-logs',
      '/broadcasts',
    ],
    resources: [
      'messages',
      'notifications',
      'notification-templates',
      'message-templates',
      'broadcasts',
    ],
  },
  {
    id: 'coding-concept',
    title: 'Coding Concept',
    description:
      'Standard terminology workspace for concept codes, metadata values, mappings, and validation lookups.',
    root: '/coding-concepts',
    apiProvider: codingConceptApi,
    routes: ['/coding-concepts'],
    resources: ['coding-concepts'],
  },
  {
    id: 'rxsoft',
    title: 'RxSoft',
    description: 'RxSoft pharmacy admin module with reporting, catalog, and operations.',
    root: '/items',
    apiProvider: rxsoftApi,
    routes: [
      '/products',
      '/categories',
      '/uoms',
      '/pharmaceutics',
      '/drug-components',
      '/manufacturers',
      '/price-lists',
      '/price-list-items',
      '/users',
      '/customers',
      '/suppliers',
      '/roles',
      '/sales',
      '/receivables',
      '/purchases',
      '/payment-methods',
      '/inventory',
      '/branches',
      '/settings',
      '/journals',
      '/journal-entries',
      '/journal-entry-lines',
      '/organizations',
    ],
    resources: [
      'products',
      'categories',
      'uoms',
      'uom-category',
      'pharmaceutics',
      'drug-components',
      'manufacturers',
      'price-lists',
      'price-list-items',
      'users',
      'customers',
      'suppliers',
      'roles',
      'sales',
      'receivables',
      'purchases',
      'payment-methods',
      'inventory',
      'stock-balances',
      'stock-movements',
      'stock-locations',
      'branches',
      'settings',
      'journals',
      'journal-entries',
      'journal-entry-lines',
      'organizations',
      'audit-logs',
    ],
  },
  {
    id: 'lis',
    title: 'LIS',
    description: 'Laboratory Information System workspace backed by the standalone LIS service.',
    root: '/lis',
    apiProvider: lisApi,
    routes: ['/lis'],
    resources: [
      'lis-test-definitions',
      'lis-reference-ranges',
      'lis-rejection-reasons',
      'lis-programs',
      'lis-location-types',
      'lis-locations',
      'lis-attribute-definitions',
      'lis-sample-types',
      'lis-priorities',
      'lis-test-categories',
      'lis-loinc',
    ],
  },
  {
    id: 'admin',
    title: 'Admin Console',
    description: 'Full shadcn-admin workspace with the normal menu and shared controls.',
    root: '/',
    apiProvider: rxsoftApi,
    routes: [],
    resources: [],
  },
];

export const moduleMap: Record<ModuleId, ModuleDefinition> = {
  conversation: modules[0],
  communication: modules[1],
  'coding-concept': modules[2],
  rxsoft: modules[3],
  lis: modules[4],
  admin: modules[5],
};

export const defaultModule: ModuleId = 'rxsoft';

export function getModuleRoot(moduleId: ModuleId) {
  return moduleMap[moduleId]?.root ?? '/';
}
