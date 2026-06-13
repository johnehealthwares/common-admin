// types/refund.ts

export type RefundItem = {
  productNumber: string;
  productName: string;
  barcode: string;
  unitPrice: number;
  quantity: number;
  amount: number;
};

export type RefundProgress = {
  time: string;
  currentProgress: string;
  state: 'success' | 'in_progress';
  operatorId: string;
  timeConsuming: string;
};

export type Refund = {
  pickupOrderNumber: string;
  state: string;
  salesOrderNumber: string;
  subOrder: string;

  userName: string;
  contactNumber: string;
  expressDelivery: string;
  pickupAddress: string;
  remark: string;

  returnedGoods: RefundItem[];
  returnProgress: RefundProgress[];
};
