import { create } from 'zustand';
// store/attribute-store.ts
import { AttributeDefinition } from '@/features/queries/bootstrap';

type AttributeStore = {
  attributes: Record<string, AttributeDefinition[]>;
  setAttributes: (moduleId: string, data: AttributeDefinition[]) => void;
  getAttributes: (moduleId: string) => AttributeDefinition[];
};

export const useAttributeStore = create<AttributeStore>((set, get) => ({
  attributes: {},

  setAttributes: (moduleId, data) =>
    set((state) => ({
      attributes: {
        ...state.attributes,
        [moduleId]: data,
      },
    })),

  getAttributes: (moduleId) => get().attributes[moduleId] ?? [],
}));
