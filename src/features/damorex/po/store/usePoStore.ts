import { create } from 'zustand';
import { PoLineItem } from '../types';

interface PoFormState {
  supplierId: string;
  supplierName: string;
  warehouseId: string;
  warehouseName: string;
  expectedDate: string;
  note: string;
  lines: PoLineItem[];
  setSupplier: (id: string, name: string) => void;
  setWarehouse: (id: string, name: string) => void;
  setExpectedDate: (date: string) => void;
  setNote: (note: string) => void;
  addLine: (line: PoLineItem) => void;
  updateLine: (id: string, updates: Partial<PoLineItem>) => void;
  removeLine: (id: string) => void;
  reset: () => void;
}

const emptyLine = (): PoLineItem => ({
  id: crypto.randomUUID(),
  itemId: '',
  orderedQty: 1,
  receivedQty: 0,
  uomId: '',
  unitCost: 0,
  discountPercent: 0,
  taxPercent: 0,
  lineSubtotal: 0,
  lineTotal: 0,
});

export const usePoStore = create<PoFormState>((set) => ({
  supplierId: '',
  supplierName: '',
  warehouseId: '',
  warehouseName: '',
  expectedDate: '',
  note: '',
  lines: [emptyLine()],

  setSupplier: (id, name) => set({ supplierId: id, supplierName: name }),
  setWarehouse: (id, name) => set({ warehouseId: id, warehouseName: name }),
  setExpectedDate: (date) => set({ expectedDate: date }),
  setNote: (note) => set({ note }),

  addLine: (line) => set((state) => ({ lines: [...state.lines, line] })),
  updateLine: (id, updates) =>
    set((state) => ({
      lines: state.lines.map((line) => {
        if (line.id !== id) return line;
        const updated = { ...line, ...updates };
        const raw = updated.orderedQty * updated.unitCost;
        const discount = raw * (updated.discountPercent / 100);
        updated.lineSubtotal = +(raw - discount).toFixed(2);
        const tax = updated.lineSubtotal * (updated.taxPercent / 100);
        updated.lineTotal = +(updated.lineSubtotal + tax).toFixed(2);
        return updated;
      }),
    })),
  removeLine: (id) => set((state) => ({ lines: state.lines.filter((l) => l.id !== id) })),
  reset: () =>
    set({
      supplierId: '',
      supplierName: '',
      warehouseId: '',
      warehouseName: '',
      expectedDate: '',
      note: '',
      lines: [emptyLine()],
    }),
}));
