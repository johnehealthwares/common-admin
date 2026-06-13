// data/refund-data.ts

import { Badge } from '@mantine/core';
import { View } from '@/features/rxsoft/types';
import { Refund } from './type';

export const refundData: Refund = {
  pickupOrderNumber: '1000000000',
  state: 'Goods picked up',
  salesOrderNumber: '1234123421',
  subOrder: '3214321432',

  userName: 'Fu Xiaoxiao',
  contactNumber: '18100000000',
  expressDelivery: 'Cainiao Warehousing',
  pickupAddress: 'No. 18 Wantang Road, Xihu District, Hangzhou City, Zhejiang Province',
  remark: 'none',

  returnedGoods: [
    {
      productNumber: '1234561',
      productName: '550ml mineral water',
      barcode: '12421432143214321',
      unitPrice: 2,
      quantity: 1,
      amount: 2,
    },
    {
      productNumber: '1234562',
      productName: '300ml of herbal tea',
      barcode: '12421432143214322',
      unitPrice: 3,
      quantity: 2,
      amount: 6,
    },
    {
      productNumber: '1234563',
      productName: 'Delicious potato chips',
      barcode: '12421432143214323',
      unitPrice: 7,
      quantity: 4,
      amount: 28,
    },
    {
      productNumber: '1234564',
      productName: 'Especially delicious egg rolls',
      barcode: '12421432143214324',
      unitPrice: 8.5,
      quantity: 3,
      amount: 25.5,
    },
  ],

  returnProgress: [
    {
      time: '2017-10-01 14:10',
      currentProgress: 'Contact customers',
      state: 'in_progress',
      operatorId: 'Pickup agent ID1234',
      timeConsuming: '5mins',
    },
    {
      time: '2017-10-01 14:05',
      currentProgress: 'Pickup clerk departs',
      state: 'success',
      operatorId: 'Pickup agent ID1234',
      timeConsuming: '1h',
    },
  ],
};

export const refundView: View<Refund> = {
  title: 'Refund Request',
  endpoint: '/concepts/:id',
  fieldGroups: [
    {
      title: 'Refund Request',
      fields: [
        {
          key: 'pickupOrderNumber',
          label: 'Pickup order number',
          col: 3,
        },
        {
          key: 'state',
          label: 'State',
          col: 3,
        },
        {
          key: 'salesOrderNumber',
          label: 'Sales order number',
          col: 3,
        },
        {
          key: 'subOrder',
          label: 'Sub-order',
          col: 3,
        },
      ],
    },

    {
      title: 'User Information',
      fields: [
        {
          key: 'userName',
          label: 'User Name',
          col: 3,
        },
        {
          key: 'contactNumber',
          label: 'Contact Number',
          col: 3,
        },
        {
          key: 'expressDelivery',
          label: 'Commonly Used Express Delivery',
          col: 3,
        },
        {
          key: 'pickupAddress',
          label: 'Pickup Address',
          col: 3,
        },
        {
          key: 'remark',
          label: 'Remark',
          col: 12,
        },
      ],
    },
  ],

  lists: [
    {
      key: 'returnedGoods',
      title: 'Returned goods',

      columns: [
        {
          key: 'productNumber',
          label: 'Product Number',
        },
        {
          key: 'productName',
          label: 'Product Name',
        },
        {
          key: 'barcode',
          label: 'Product barcode',
        },
        {
          key: 'unitPrice',
          label: 'Unit price',
        },
        {
          key: 'quantity',
          label: 'Quantity',
        },
        {
          key: 'amount',
          label: 'Amount',
        },
      ],

      footer: (rows) => {
        const totalQty = rows.reduce((a, b) => a + b.quantity, 0);
        const totalAmount = rows.reduce((a, b) => a + b.amount, 0);

        return (
          <>
            <td />
            <td />
            <td />
            <td
              style={{
                fontWeight: 700,
              }}
            >
              Total
            </td>
            <td>{totalQty}</td>
            <td>{totalAmount}</td>
          </>
        );
      },
    },

    {
      key: 'returnProgress',
      title: 'Return progress',

      columns: [
        {
          key: 'time',
          label: 'Time',
        },
        {
          key: 'currentProgress',
          label: 'Current Progress',
        },
        {
          key: 'state',
          label: 'State',
          render: (value) => (
            <Badge color={value === 'success' ? 'green' : 'blue'} variant="light">
              {value}
            </Badge>
          ),
        },
        {
          key: 'operatorId',
          label: 'Operator ID',
        },
        {
          key: 'timeConsuming',
          label: 'Time Consuming',
        },
      ],
    },
  ],
};
