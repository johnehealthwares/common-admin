import { ModuleId } from '@/features/shared/module-data'

export type RouteModuleMapping = Record<string, ModuleId[]>

/**
 * Route to module mappings.
 * Routes not listed here are available in all modules.
 * 'admin' module always has access to everything.
 */
export const routeModuleMap: RouteModuleMapping = {
  // Conversation module routes
  '/conversations': ['conversation', 'admin'],
  '/conversations/': ['conversation', 'admin'],
  '/participants': ['conversation', 'admin'],
  '/questionnaires': ['conversation', 'admin'],
  '/questions': ['conversation', 'admin'],
  '/workflows': ['conversation', 'admin'],
  '/workflow-configuration': ['conversation', 'admin'],
  '/workflow-instances': ['conversation', 'admin'],
  '/workflow-events': ['conversation', 'admin'],
  '/channels': ['conversation', 'admin'],
  '/exchanges': ['conversation', 'admin'],

  // Switch module routes
  '/aes': ['communication', 'admin'],
  '/messages/': ['communication', 'admin'],
  '/notifications': ['communication', 'admin'],
  '/notification-templates': ['communication', 'admin'],
  '/message-templates': ['communication', 'admin'],
  '/communication-channels': ['communication', 'admin'],
  '/message-logs': ['communication', 'admin'],
  '/broadcasts': ['communication', 'admin'],

  // Coding concept module routes
  '/coding-concepts': ['coding-concept', 'admin'],
  '/coding-concepts/': ['coding-concept', 'admin'],
  '/coding-concepts/search': ['coding-concept', 'admin'],
  '/coding-concepts/match': ['coding-concept', 'admin'],
  '/coding-concepts/upload': ['coding-concept', 'admin'],

  // RxSoft module routes
  '/products': ['rxsoft', 'admin'],
  '/categories': ['rxsoft', 'admin'],
  '/uoms': ['rxsoft', 'admin'],
  '/pharmaceutics': ['rxsoft', 'admin'],
  '/drug-components': ['rxsoft', 'admin'],
  '/manufacturers': ['rxsoft', 'admin'],
  '/price-lists': ['rxsoft', 'admin'],
  '/price-list-items': ['rxsoft', 'admin'],
  '/users': ['rxsoft', 'admin'],
  '/customers': ['rxsoft', 'admin'],
  '/suppliers': ['rxsoft', 'admin'],
  '/roles': ['rxsoft', 'admin'],
  '/sales': ['rxsoft', 'admin'],
  '/receivables': ['rxsoft', 'admin'],
  '/purchases': ['rxsoft', 'admin'],
  '/payment-methods': ['rxsoft', 'admin'],
  '/inventory': ['rxsoft', 'admin'],
  '/branches': ['rxsoft', 'admin'],
  '/settings': ['rxsoft', 'admin'],
  '/journals': ['rxsoft', 'admin'],
  '/journal-entries': ['rxsoft', 'admin'],
  '/journal-entry-lines': ['rxsoft', 'admin'],
  '/organizations': ['rxsoft', 'admin'],

  // Dashboard available to all
  '/': ['rxsoft', 'conversation', 'communication', 'admin'],
  '/dashboard': ['rxsoft', 'conversation', 'communication', 'admin'],
}

/**
 * Check if a route is allowed for the given module.
 * Admin module has unrestricted access.
 */
export function isRouteAllowedForModule(pathname: string, moduleId: ModuleId): boolean {
  if (moduleId === 'admin') {
    return true
  }

  // Check exact match
  if (routeModuleMap[pathname]) {
    return routeModuleMap[pathname].includes(moduleId)
  }

  // Check prefix match (e.g., /products/123 matches /products)
  const pathSegments = pathname.split('/').filter(Boolean)
  if (pathSegments.length > 1) {
    const parentRoute = '/' + pathSegments[0]
    if (routeModuleMap[parentRoute]) {
      return routeModuleMap[parentRoute].includes(moduleId)
    }
  }

  // Default: allow (catch-all routes like / are allowed everywhere)
  return true
}

/**
 * Get the base dashboard route for a module.
 */
export function getModuleDashboard(moduleId: ModuleId): string {
  switch (moduleId) {
    case 'conversation':
      return '/conversations'
    case 'communication':
      return '/messages'
    case 'coding-concept':
      return '/coding-concepts'
    case 'rxsoft':
      return '/'
    case 'admin':
      return '/'
    default:
      return '/'
  }
}
