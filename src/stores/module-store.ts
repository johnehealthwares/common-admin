import { create } from 'zustand'
import { defaultModule, modules, type ModuleId } from '@/features/shared/module-data'

const MODULE_STORAGE_KEY = 'rxsoft_admin_selected_module'

const getInitialModule = (): ModuleId => {
  if (typeof window === 'undefined') {
    return defaultModule
  }

  const stored = window.localStorage.getItem(MODULE_STORAGE_KEY)
  if (stored && modules.some((module) => module.id === stored)) {
    return stored as ModuleId
  }

  return defaultModule
}

type ModuleState = {
  selectedModule: ModuleId
  setSelectedModule: (moduleId: ModuleId) => void
}

export const useModuleStore = create<ModuleState>((set) => ({
  selectedModule: getInitialModule(),
  setSelectedModule: (selectedModule) => {
    set({ selectedModule })
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(MODULE_STORAGE_KEY, selectedModule)
    }
  },
}))
