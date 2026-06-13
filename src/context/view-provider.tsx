// providers/view-provider.tsx

import { createContext, useContext, useMemo } from 'react';
import { useAttributeStore } from '@/stores/attributes';

type ViewProviderValue = {
  getAttributes: (moduleId: string) => any[];
};

const ViewProviderContext = createContext<ViewProviderValue | null>(null);

export function ViewProvider({ children }: { children: React.ReactNode }) {
  const attributes = useAttributeStore((s) => s.attributes);

  const value = useMemo(
    () => ({
      getAttributes: (moduleId: string) => attributes[moduleId] ?? [],
    }),
    [attributes]
  );

  return <ViewProviderContext.Provider value={value}>{children}</ViewProviderContext.Provider>;
}

export function useViewProvider() {
  const ctx = useContext(ViewProviderContext);

  if (!ctx) {
    throw new Error('useViewProvider must be used inside ViewProvider');
  }

  return ctx;
}
