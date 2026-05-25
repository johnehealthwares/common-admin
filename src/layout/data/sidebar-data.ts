import {
  AudioWaveform,
  Boxes,
  ChartColumn,
  CircleDashed,
  MessageSquare,
  Cog,
  Command,
  ContactRound,
  CreditCard,
  FileText,
  GitBranch,
  HandCoins,
  LayoutDashboard,
  Layers3,
  Microscope,
  NotebookPen,
  Package,
  Pill,
  Radio,
  ReceiptText,
  Scale,
  Shield,
  ShoppingCart,
  Shuffle,
  Tags,
  Truck,
  Users,
  Waypoints,
  Workflow,
  Store,
  BookOpen,
  Receipt,
  ShieldCheck,
  MessagesSquare,
  Braces,
} from 'lucide-react'
import { NavItem, type SidebarData } from '../types'
import type { ModuleId } from '@/features/shared/module-data'
import { lisResources } from '@/features/rxsoft/pages/lis/resources'

export function filterNavGroupsByModule(
  navGroups: NavItem[],
  selectedModule: ModuleId
): NavItem[] {
  return navGroups
    .map((group: NavItem) => ({
      ...group,
      items: (group.items || []).filter(
        (item) => selectedModule === 'admin' || !item.modules || item.modules.includes(selectedModule)
      ),
      url: undefined
    }))
    .filter((group) => group.items.length > 0)
}

export const sidebarData: SidebarData = {
  user: {
    name: 'RxSoft User',
    email: 'Admin console',
    avatar: '',
  },
  teams: [
    {
      name: 'RxSoft',
      logo: Command,
      plan: 'Pharmacy Admin',
      moduleId: 'rxsoft',
    },
    {
      name: 'Switch',
      logo: AudioWaveform,
      plan: 'Messaging & Routing',
      moduleId: 'communication',
    },
    {
      name: 'Conversation',
      logo: MessageSquare,
      plan: 'Workflow Chat',
      moduleId: 'conversation',
    },
    {
      name: 'Coding Concept',
      logo: Boxes,
      plan: 'Terminology',
      moduleId: 'coding-concept',
    },
    {
      name: 'LIS',
      logo: Microscope,
      plan: 'Laboratory',
      moduleId: 'lis',
    },
  ],
  navGroups: [
    {
      title: 'Overview',
      icon: LayoutDashboard,
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
          modules: ['rxsoft', 'admin'],
        },
        {
          title: 'Reports',
          url: '/reports',
          icon: ChartColumn,
          modules: ['rxsoft', 'admin'],
        },
        {
          title: 'Audit Logs',
          url: '/audit-logs',
          icon: Package,
          modules: ['rxsoft', 'admin'],
        },
      ],
    },
    {
      title: 'Catalog',
      icon: BookOpen,
      items: [
        {
          title: 'Products',
          url: '/products',
          icon: Package,
          modules: ['rxsoft', 'admin'],
        },
        {
          title: 'Categories',
          url: '/categories',
          icon: Tags,
          modules: ['rxsoft', 'admin'],
        },
        {
          title: 'UOMs',
          url: '/uoms',
          icon: Scale,
          modules: ['rxsoft', 'admin'],
        },
        {
          title: 'Pharmaceutics',
          url: '/pharmaceutics',
          icon: Pill,
          modules: ['rxsoft', 'admin'],
        },
        {
          title: 'Drug Components',
          url: '/drug-components',
          icon: Layers3,
          modules: ['rxsoft', 'admin'],
        },
        {
          title: 'Manufacturers',
          url: '/manufacturers',
          icon: Truck,
          modules: ['rxsoft', 'admin'],
        },
        {
          title: 'Price Lists',
          url: '/price-lists',
          icon: Tags,
          modules: ['rxsoft', 'admin'],
        },
        {
          title: 'Price List Items',
          url: '/price-list-items',
          icon: ReceiptText,
          modules: ['rxsoft', 'admin'],
        },
      ],
    },
    {
      title: 'People',
      icon: Users,
      items: [
        {
          title: 'Users',
          url: '/users',
          icon: Users,
          modules: ['rxsoft', 'admin'],
        },
        {
          title: 'Customers',
          url: '/customers',
          icon: ContactRound,
          modules: ['rxsoft', 'admin'],
        },
        {
          title: 'Suppliers',
          url: '/suppliers',
          icon: Truck,
          modules: ['rxsoft', 'admin'],
        },
        {
          title: 'Roles',
          url: '/roles',
          icon: Shield,
          modules: ['rxsoft', 'admin'],
        },
      ],
    },
    {
      title: 'Operations',
      icon: Workflow,
      items: [
        {
          title: 'Sales',
          url: '/sales',
          icon: ShoppingCart,
          modules: ['rxsoft', 'admin'],
        },
        {
          title: 'Receivables',
          url: '/receivables',
          icon: HandCoins,
          modules: ['rxsoft', 'admin'],
        },
        {
          title: 'Purchases',
          url: '/purchases',
          icon: ReceiptText,
          modules: ['rxsoft', 'admin'],
        },
        {
          title: 'Payment Methods',
          url: '/payment-methods',
          icon: CreditCard,
          modules: ['rxsoft', 'admin'],
        },
        {
          title: 'Inventory',
          url: '/inventory',
          icon: Boxes,
          modules: ['rxsoft', 'admin'],
        },
        {
          title: 'Branches',
          url: '/branches',
          icon: GitBranch,
          modules: ['rxsoft', 'admin'],
        },
        {
          title: 'Settings',
          url: '/settings',
          icon: Cog,
          modules: ['rxsoft', 'admin'],
        },
      ],
    },
    {
      title: 'Finance',
      icon: Receipt,
      items: [
        {
          title: 'Journals',
          url: '/journals',
          icon: NotebookPen,
          modules: ['rxsoft', 'admin'],
        },
        {
          title: 'Journal Entries',
          url: '/journal-entries',
          icon: NotebookPen,
          modules: ['rxsoft', 'admin'],
        },
        {
          title: 'Journal Entry Lines',
          url: '/journal-entry-lines',
          icon: NotebookPen,
          modules: ['rxsoft', 'admin'],
        },
      ],
    },
    {
      title: 'Administration',
      icon: ShieldCheck,
      items: [
        {
          title: 'Organizations',
          url: '/organizations',
          icon: Shield,
          modules: ['rxsoft', 'admin'],
        },
        {
          title: 'Locations',
          url: '/stock-locations',
          icon: Store,
          modules: ['rxsoft', 'admin'],
        },
      ],
    },
    {
      title: 'Conversation',
      icon: MessagesSquare,
      items: [
        {
          title: 'Questionnaires',
          url: '/questionnaires',
          icon: FileText,
          modules: ['conversation', 'admin'],
        },
        {
          title: 'Conversations',
          url: '/conversations',
          icon: MessageSquare,
          modules: ['conversation', 'admin'],
        },
        {
          title: 'Chats',
          url: '/chats',
          icon: MessageSquare,
          modules: ['conversation', 'admin'],
        },
        {
          title: 'Participants',
          url: '/participants',
          icon: ContactRound,
          modules: ['conversation', 'admin'],
        },
        {
          title: 'Questions',
          url: '/questions',
          icon: CircleDashed,
          modules: ['conversation', 'admin'],
        },
        {
          title: 'Workflows',
          url: '/workflows',
          icon: Workflow,
          modules: ['conversation', 'admin'],
        },
        {
          title: 'Workflow Configuration',
          url: '/workflow-configuration',
          icon: Workflow,
          modules: ['conversation', 'admin'],
        },
        {
          title: 'Workflow Instances',
          url: '/workflow-instances',
          icon: Shuffle,
          modules: ['conversation', 'admin'],
        },
        {
          title: 'Workflow Events',
          url: '/workflow-events',
          icon: Waypoints,
          modules: ['conversation', 'admin'],
        },
        {
          title: 'Channels',
          url: '/channels',
          icon: Radio,
          modules: ['conversation', 'admin'],
        },
        {
          title: 'Exchanges',
          url: '/exchanges',
          icon: FileText,
          modules: ['conversation', 'admin'],
        },

        {
          title: 'Messages',
          url: '/messages',
          icon: MessageSquare,
          modules: ['conversation', 'admin'],
        },
        {
          title: 'Notifications',
          url: '/notifications',
          icon: MessageSquare,
          modules: ['conversation', 'admin'],
        },
        {
          title: 'Broadcasts',
          url: '/broadcasts',
          icon: Radio,
          modules: ['conversation', 'admin'],
        },
        {
          title: 'Message Templates',
          url: '/message-templates',
          icon: FileText,
          modules: ['conversation', 'admin'],
        },
        {
          title: 'Notification Templates',
          url: '/notification-templates',
          icon: FileText,
          modules: ['conversation', 'admin'],
        },
        {
          title: 'Communication Channels',
          url: '/communication-channels',
          icon: Radio,
          modules: ['conversation', 'admin'],
        },
        {
          title: 'Message Logs',
          url: '/message-logs',
          icon: FileText,
          modules: ['conversation', 'admin'],
        }
      ],
    },
    {
      title: 'Switch',
      icon: Waypoints,
      items: [
        {
          title: 'Application Entities',
          url: '/aes',
          icon: MessageSquare,
          modules: ['communication', 'admin'],
        },
        {
          title: 'Routes',
          url: '/routing',
          icon: MessageSquare,
          modules: ['communication', 'admin'],
        },
        {
          title: 'Mapping',
          url: '/mapping',
          icon: MessageSquare,
          modules: ['communication', 'admin'],
        },
        {
          title: 'Event Traces',
          url: '/communication/audit-center',
          icon: FileText,
          modules: ['communication', 'admin'],
        },

        {
          title: 'Flow Graph',
          url: '/communication/flow-graph',
          icon: Layers3,
          modules: ['communication', 'admin'],
        },
        {
          title: 'Trace Explorer',
          url: '/communication/trace-explorer',
          icon: Waypoints,
          modules: ['communication', 'admin'],
        },
        {
          title: 'Message Tester',
          url: '/communication/message-tester',
          icon: MessageSquare,
          modules: ['communication', 'admin'],
        },
      ],
    },
    {
      title: 'Coding Concept',
      icon: Braces,
      items: [
        {
          title: 'Concept Registry',
          url: '/coding-concepts',
          icon: Layers3,
          modules: ['coding-concept', 'admin'],
        },
        {
          title: 'Search',
          url: '/coding-concepts/search',
          icon: Waypoints,
          modules: ['coding-concept', 'admin'],
        },
        {
          title: 'Match',
          url: '/coding-concepts/match',
          icon: GitBranch,
          modules: ['coding-concept', 'admin'],
        },
        {
          title: 'Upload',
          url: '/coding-concepts/upload',
          icon: FileText,
          modules: ['coding-concept', 'admin'],
        },
      ],
    },
    {
      title: "LIS",
      icon: Microscope,
      items: lisResources.map((lisResource) => ({
           title: lisResource.title,
          url: '/lis/' + lisResource.key,
          icon: Microscope,
          modules: ['lis', 'admin'],
        })),
    }
  ],
}
