import { AxiosInstance } from 'axios';
import { createContext, useContext } from 'react';
import { type ModuleId, type ModuleDefinition, moduleMap } from '@/features/shared/module-data';

export type ModuleContextType = {
  selectedModule: ModuleId;
  setSelectedModule: (moduleId: ModuleId) => void;
  currentModuleDefinition: ModuleDefinition;
  moduleId: ModuleId;
  apiProvider: AxiosInstance;
  moduleName: string;
  moduleDescription: string;
  moduleRoot: string;
  modules: ModuleDefinition[];
};

export const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

export function useModuleContext(): ModuleContextType {
  const context = useContext(ModuleContext);
  if (!context) {
    throw new Error('useModuleContext must be used within a ModuleProvider');
  }
  return context;
}

/**
 * Hook to get the current module ID
 */
export function useModuleId(): ModuleId {
  return useModuleContext().moduleId;
}

/**
 * Hook to get the API provider for the current module
 */
export function useApiProvider(): AxiosInstance {
  return useModuleContext().apiProvider;
}

/**
 * Hook to get the current module name
 */
export function useModuleName(): string {
  return useModuleContext().moduleName;
}

/**
 * Hook to get the current module definition
 */
export function useModuleDefinition(): ModuleDefinition {
  return useModuleContext().currentModuleDefinition;
}

/**
 * Hook to change the selected module
 */
export function useSetSelectedModule() {
  return useModuleContext().setSelectedModule;
}

/**
 * Hook to get all available modules
 */
export function useAvailableModules(): ModuleDefinition[] {
  return useModuleContext().modules;
}
