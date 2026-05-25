/**
 * Legacy module store using the ModuleContext
 * This file provides a compatibility layer for existing code that uses useModuleStore.
 * 
 * Migration Guide:
 * - useModuleStore() -> useModuleContext()
 * - useModuleStore().selectedModule -> useModuleId()
 * - useModuleStore().setSelectedModule -> useSetSelectedModule()
 * 
 * For new code, please use the context hooks directly:
 * import { useModuleId, useModuleContext, useSetSelectedModule } from '@/context/module-context'
 */

import { useModuleContext } from '@/context/module-context'

/**
 * @deprecated Use useModuleContext() instead
 */
export function useModuleStore() {
  const context = useModuleContext()
  
  return {
    selectedModule: context.moduleId,
    setSelectedModule: context.setSelectedModule,
    // Additional properties for extended functionality
    currentModule: context.currentModuleDefinition,
    apiProvider: context.apiProvider,
    moduleName: context.moduleName,
    moduleDescription: context.moduleDescription,
    moduleRoot: context.moduleRoot,
    modules: context.modules,
  }
}
