import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from './types';

interface SavedItem {
  productId: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  savedForLater: SavedItem[];
  addItem: (productId: string, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  itemCount: () => number;
  totalItems: number;
  subtotal: number;
  saveForLater: (productId: string) => void;
  moveToCart: (productId: string) => void;
  removeSaved: (productId: string) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      savedForLater: [],
      totalItems: 0,
      subtotal: 0,

      addItem: (productId, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.productId === productId);
          let items: CartItem[];
          if (existing) {
            items = state.items.map((i) =>
              i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i
            );
          } else {
            items = [...state.items, { productId, quantity }];
          }
          return {
            items,
            totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
            subtotal: items.reduce(
              (sum, i) => sum + (i.product as any)?.price * i.quantity || 0,
              0
            ),
          };
        });
      },

      updateQuantity: (productId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            const items = state.items.filter((i) => i.productId !== productId);
            return {
              items,
              totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
              subtotal: items.reduce(
                (sum, i) => sum + (i.product as any)?.price * i.quantity || 0,
                0
              ),
            };
          }
          const items = state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          );
          return {
            items,
            totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
            subtotal: items.reduce(
              (sum, i) => sum + (i.product as any)?.price * i.quantity || 0,
              0
            ),
          };
        });
      },

      removeItem: (productId) => {
        set((state) => {
          const items = state.items.filter((i) => i.productId !== productId);
          return {
            items,
            totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
            subtotal: items.reduce(
              (sum, i) => sum + (i.product as any)?.price * i.quantity || 0,
              0
            ),
          };
        });
      },

      clearCart: () => set({ items: [], totalItems: 0, subtotal: 0 }),

      itemCount: () => get().items.length,

      saveForLater: (productId) => {
        const item = get().items.find((i) => i.productId === productId);
        if (!item) {
          return;
        }
        const saved = { productId: item.productId, quantity: item.quantity };
        set((state) => {
          const items = state.items.filter((i) => i.productId !== productId);
          return {
            items,
            savedForLater: [...state.savedForLater, saved],
            totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
            subtotal: items.reduce(
              (sum, i) => sum + (i.product as any)?.price * i.quantity || 0,
              0
            ),
          };
        });
      },

      moveToCart: (productId) => {
        const saved = get().savedForLater.find((i) => i.productId === productId);
        if (!saved) {
          return;
        }
        set((state) => {
          const existing = state.items.find((i) => i.productId === productId);
          let items: CartItem[];
          if (existing) {
            items = state.items.map((i) =>
              i.productId === productId ? { ...i, quantity: i.quantity + saved.quantity } : i
            );
          } else {
            items = [...state.items, { productId: saved.productId, quantity: saved.quantity }];
          }
          return {
            items,
            savedForLater: state.savedForLater.filter((i) => i.productId !== productId),
            totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
            subtotal: items.reduce(
              (sum, i) => sum + (i.product as any)?.price * i.quantity || 0,
              0
            ),
          };
        });
      },

      removeSaved: (productId) => {
        set((state) => ({
          savedForLater: state.savedForLater.filter((i) => i.productId !== productId),
        }));
      },
    }),
    {
      name: 'damorex-cart',
      merge: (persisted, current) => ({
        ...current,
        ...(persisted as object),
        savedForLater: (persisted as any)?.savedForLater ?? [],
      }),
    }
  )
);
