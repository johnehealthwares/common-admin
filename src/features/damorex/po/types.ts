export interface PoLineItem {
  id: string;
  itemId: string;
  itemCode?: string;
  itemName?: string;
  orderedQty: number;
  receivedQty: number;
  uomId: string;
  uomName?: string;
  unitCost: number;
  discountPercent: number;
  taxPercent: number;
  lineSubtotal: number;
  lineTotal: number;
}

export interface PurchaseOrder {
  id: string;
  purchaseOrderNumber: string;
  supplierId: string;
  supplierName?: string;
  warehouseId: string;
  warehouseName?: string;
  currencyCode: string;
  orderDate: string;
  expectedDate: string | null;
  status: 'draft' | 'approved' | 'partially_received' | 'received' | 'cancelled';
  subtotalAmount: number;
  taxAmount: number;
  totalAmount: number;
  note: string | null;
  lines: PoLineItem[];
  createdAt: string;
}

export interface GoodsReceipt {
  id: string;
  receiptNumber: string;
  purchaseOrderId: string;
  purchaseOrderNumber?: string;
  receivedDate: string;
  note: string | null;
  lines: Array<{
    itemId: string;
    itemName?: string;
    orderedQty: number;
    receivedQty: number;
    uomId: string;
    unitCost: number;
  }>;
}
