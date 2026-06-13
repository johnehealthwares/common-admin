import { Text } from '@mantine/core';
import { AxiosInstance } from 'axios';
import type {} from '@/features/components/page/rx-page';
import { EQUALS_WITH_OPTIONS, FieldGroup, FilterType, TabGroup } from '@/features/rxsoft/types';
import { rxsoftApi } from '@/lib/rxsoft-api';
import { buildPayload as buildPriceListPayload } from '../../price-list-items/schema';
import { ProductImagesTab } from '../components/product-images-tab';
import type {
  PendingPriceListEntry,
  PendingStockEntry,
} from '../components/product-setup-components';
import {
  buildCreatePricePayload,
  buildUpdatePricePayload,
  getRowsFromResponse,
  mergePricingLists,
  mergeRowToSaved,
  PricingMatrixRow,
  validatePricingRow,
} from '../utils/pricing-matrix-helper';

const itemCreateFieldGroups: FieldGroup[] = [
  {
    title: 'Classification',
    fields: [
      {
        name: 'category',
        label: 'Category',
        type: 'async-select',
        searchParam: {
          endpoint: '/categories',
          minChars: 2,
          valueKey: 'id',
          labelKey: 'name',
          queryParam: 'search',
        },
        col: 6,
        required: true,
        placeholder: 'Select Category',
      },
      {
        name: 'genericProduct',
        label: 'Generic Product',
        type: 'async-select',
        searchParam: {
          endpoint: '/generic-products',
          minChars: 2,
          queryParam: 'search',
          labelKey: 'name',
          valueKey: 'id',
        },
        col: 6,
        required: true,
        placeholder: 'Select Generic Product',
      },
    ],
  },
  {
    title: 'Basic Information',
    fields: [
      { name: 'name', label: 'Item Name (Brand/Variety)', required: true, col: 6 },
      { name: 'code', label: 'Code', required: true, col: 6 },
      { name: 'barcode', label: 'Barcode', col: 6 },
      { name: 'imageUrl', label: 'Image URL', col: 12, hidden: true },
      { name: 'smallImageUrl', label: 'Small Image URL', col: 12, hidden: true },
      { name: 'mediumImageUrl', label: 'Medium Image URL', col: 12, hidden: true },
      { name: 'largeImageUrl', label: 'Large Image URL', col: 12, hidden: true },
    ],
  },
  {
    title: 'Units of Measure',
    fields: [
      {
        name: 'baseUom',
        label: 'Base UOM',
        type: 'async-select',
        searchParam: {
          endpoint: '/uoms',
          minChars: 2,
          queryParam: 'search',
          filter: {
            type: 'CONTAINS',
            field: 'uomType',
          },
          labelKey: 'name',
          valueKey: 'id',
          staticFilters: [
            {
              filter: {
                type: FilterType.EQUALS,
                name: 'uomType',
              },
              value: 'reference',
            },
          ],
        },
        required: true,
        col: 4,
      },
      {
        name: 'purchaseUom',
        label: 'Purchase UOM',
        type: 'async-select',
        searchParam: {
          endpoint: '/uoms',
          minChars: 2,
          queryParam: 'search',
          labelKey: 'name',
          valueKey: 'id',
          staticFilters: [
            {
              filter: {
                type: FilterType.NOT_EQUALS,
                name: 'uomType',
              },
              value: 'reference',
            },
          ],
        },
        col: 4,
      },
      {
        name: 'saleUom',
        label: 'Sale UOM',
        type: 'async-select',
        searchParam: {
          endpoint: '/uoms',
          minChars: 2,
          queryParam: 'search',
          labelKey: 'name',
          valueKey: 'id',
          staticFilters: [
            {
              filter: {
                type: FilterType.EQUALS,
                name: 'uomType',
              },
              value: 'reference',
            },
          ],
        },
        col: 4,
      },
    ],
  },
  {
    title: 'Status',
    fields: [
      {
        name: 'isActive',
        label: 'Active',
        type: 'switch',
        defaultValue: true,
        col: 6,
      },
      {
        name: 'trackExpiry',
        label: 'Track Expiry',
        type: 'switch',
        defaultValue: true,
        col: 6,
      },
    ],
  },
];

const itemPriceListFieldGroups: FieldGroup[] = [
  {
    title: 'Pricing ',
    mutationMode: 'cell',
    renderer: 'matrix',
    formStateField: 'priceListItems',
    rowsField: 'pricingMatrixRows',
    parentId: 'itemId',
    mergeRowToSaved,
    buildPayload: (localFormState: any) => {
      return {
        priceListId: localFormState.priceList.value,
        itemId: localFormState.itemId,
        currencyCode: localFormState.currencyCode || 'NGN',
        unitPrice: Number(localFormState.unitPrice),
      };
    },
    defaultState: {
      currencyCode: 'NGN',
      unitPrice: '',
    },
    endpoint: {
      url: '/price-lists/items',
      method: 'get',
      query: [{ formKey: 'id', paramKey: 'priceListItemId' }],
    },
    columns: [
      { key: 'priceListName', label: 'PriceList' },
      { key: 'currencyCode', label: 'Currency' },
      {
        key: 'unitPrice',
        label: 'Price',
        editable: true,
        field: {
          name: 'unitPrice',
          label: 'Price',
          type: 'number',
          col: 3,
          required: true,
          updateField: (row, name, value) => {
            console.log({ row, name, value });
          }, //updateMatrixRow(row, name, value)
        },
      },
      {
        key: 'status',
        label: 'Status',
        render: (row) => (
          <Text size="sm" c={row.dirty ? 'orange' : row.exists ? 'green' : 'dimmed'}>
            {row.dirty ? 'Unsaved' : row.exists ? 'Saved' : 'New'}
          </Text>
        ),
      },
    ],
    rowActions: [
      { label: 'Save', action: 'save-price' },
      { label: 'Reset', action: 'reset-price' },
    ],
    fields: [
      {
        name: 'itemId',
        label: 'Item Override',
        type: 'hidden',
        disabled: true,
        value: { formKey: 'id', paramKey: 'itemId' },
      },
      {
        name: 'priceList',
        label: 'Price List',
        type: 'async-select',
        col: 6,
        searchParam: {
          endpoint: '/price-lists',
          minChars: 2,
          queryParam: 'search',
          valueKey: 'id',
          labelKey: 'name',
        },
        required: true,
        placeholder: 'Select Price List',
      },
      {
        name: 'currencyCode',
        label: 'Currency Code',
        defaultValue: 'NGN',
        placeholder: 'Select Currency',
        type: 'text',
        col: 3,
        disabled: true,
        required: true,
      },
      {
        name: 'unitPrice',
        label: 'Unit Price',
        type: 'number',
        col: 3,
        required: true,
        // updateField: (row, name, value) => updateMatrixRow(row.id, name, value)
      },
    ],
    matrix: {
      load: async ({ itemId }: { itemId: string }) => {
        const [lists, items] = await Promise.all([
          rxsoftApi.get('/price-lists', { params: { page: 1, limit: 10 } }),
          rxsoftApi.get('/price-lists/items', { params: { itemId, page: 1, limit: 10 } }),
        ]);

        return mergePricingLists(getRowsFromResponse(lists.data), getRowsFromResponse(items.data));
      },

      save: async (row: PricingMatrixRow & { itemId: string }) => {
        console.log({ row });
        if (row.exists) {
          return rxsoftApi.patch(
            `/price-lists/${row.priceListId}/items/${row.id}`,
            buildUpdatePricePayload(row)
          );
        }

        return rxsoftApi.post('/price-lists/items', buildCreatePricePayload(row, row.itemId));
      },

      validate: validatePricingRow,

      manualEntry: {
        initialValues: {
          currencyCode: 'NGN',
        },

        create: async ({
          values,
          itemId,
        }: {
          api: AxiosInstance;
          values: PricingMatrixRow;
          itemId: string;
        }) => {
          return rxsoftApi.post('/price-lists/items', {
            ...values,
            itemId,
          });
        },
      },
    },
  },
];

export const stockFields: FieldGroup[] = [
  {
    title: 'Stock Setup',
    mutationMode: 'row',
    endpoint: {
      url: '/stock-items',
      method: 'post',
      query: [{ formKey: 'id', paramKey: 'itemId' }],
    },
    formStateField: 'stockEntries',
    columns: [
      { key: 'locationId', label: 'Location' },
      { key: 'uomId', label: 'UOM' },
      { key: 'quantity', label: 'Quantity' },
    ],
    fields: [
      {
        name: 'itemId',
        type: 'hidden',
        label: 'Item',
        disabled: true,
      },
      {
        name: 'locationId',
        label: 'Location',
        type: 'async-select',
        searchParam: {
          endpoint: '/stock-locations',
          minChars: 2,
          queryParam: 'search',
          valueKey: 'id',
          labelKey: 'name',
        },
        col: 6,
      },
      {
        name: 'uomId',
        label: 'UOM',
        placeholder: 'Select UOM',
        type: 'async-select',
        searchParam: {
          endpoint: '/uoms',
          minChars: 2,
          queryParam: 'search',
          valueKey: 'id',
          labelKey: 'name',
        },
        col: 3,
      },
      {
        name: 'quantity',
        label: 'Quantity',
        type: 'number',
        col: 2,
      },
    ],
  },
];

export const tabGroups: TabGroup[] = [
  {
    title: 'Item Details',
    value: 'item-details',
    fieldGroups: itemCreateFieldGroups,
  },
  {
    title: 'Price List',
    value: 'price-list',
    waitFor: 'id',
    disabledToolTip: 'Create item before price setup',
    fieldGroups: itemPriceListFieldGroups,
  },
  {
    title: 'Stock Entries',
    value: 'stock-entries',
    waitFor: 'id',
    disabledToolTip: 'Create item before stock setup',
    fieldGroups: stockFields,
  },
  {
    title: 'Images',
    value: 'images',
    waitFor: 'id',
    disabledToolTip: 'Create item before adding images',
    render: ({ formState, updateField }) => (
      <ProductImagesTab
        values={formState as Record<string, string>}
        onChange={(field, url) => updateField(field, url)}
      />
    ),
  },
];

function hasNumericValue(value: unknown) {
  return value !== '' && value !== null && value !== undefined && Number.isFinite(Number(value));
}

export const buildFormState = (row: Record<string, any>) => {
  const formState = { ...row };
  for (const key in row) {
    // check for fields like categoryId, baseUomId, etc.
    if (key.endsWith('Id')) {
      const fieldName = key.replace('Id', '');
      const relation = row[fieldName];
      // if related object exists
      if (relation?.id && relation?.name) {
        formState[fieldName] = {
          label: relation.name,
          value: relation.id,
        };
      }
    }
  }

  return formState;
};

import { Switch } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnTypeFilters, type Column } from '@/features/rxsoft/types';
import type { ModelConfig } from '@/features/shared/model-schema';

function ToggleActive({ row, onToggle }: { row: Record<string, unknown>; onToggle?: () => void }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (isActive: boolean) =>
      rxsoftApi.patch(`/items/${String(row.id)}`, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rxsoft-data-page', '/items'] });
      onToggle?.();
    },
    onError: () => {
      notifications.show({ color: 'red', message: 'Failed to update item status' });
    },
  });

  return (
    <Switch
      checked={Boolean(row.isActive)}
      onChange={(e) => mutation.mutate(e.currentTarget.checked)}
      disabled={mutation.isPending}
      size="sm"
    />
  );
}

export const itemColumns: Column[] = [
  { key: 'category.name', label: 'Category' },
  { key: 'name', label: 'Item Name', filters: ColumnTypeFilters.STRING },
  { key: 'code', label: 'Code' },
  { key: 'barcode', label: 'Barcode' },
  {
    key: 'isActive',
    label: 'Active',
    render: (row) => <ToggleActive row={row} />,
    filters: EQUALS_WITH_OPTIONS([
      { value: 'true', label: 'Active' },
      { value: 'false', label: 'Inactive' },
    ])
  },
];

export const itemsConfig: ModelConfig = {
  id: 'items',
  title: 'Items',
  description: 'Manage item catalog records.',
  endpoint: '/items',
  columns: itemColumns,
  tabGroups,
  modalTitle: 'Add Item',
  buildCreatePayload: buildItemPayload,
  buildUpdatePayload: buildItemPayload,
  buildFormState,
  createPathBuilder: () => '/items/create',
  detailPathBuilder: (row) => `/items/${String(row.id)}`,
};

export function buildItemPayload(values: Record<string, any>) {
  const priceListEntries = ((values.priceListItems as PendingPriceListEntry[] | undefined) ?? [])
    .filter((entry) => entry.priceList && hasNumericValue(entry.unitPrice))
    .map(buildPriceListPayload);

  const stockItems = ((values.stockEntries as PendingStockEntry[] | undefined) ?? [])
    .filter((entry) => entry.locationId && hasNumericValue(entry.quantity))
    .map((entry) => ({
      locationId: entry.locationId,
      deltaQuantity: Number(entry.quantity),
      reason: 'Initial stock setup from item creation',
    }));

  return {
    code: values.code,
    name: values.name,
    categoryId: (values.category as any).value,
    genericProductId: (values.genericProduct as any).value,
    baseUomId: (values.baseUom as any).value,
    purchaseUomId: (values as any).purchaseUom.value,
    saleUomId: (values as any).saleUom.value || undefined,
    barcode: values.barcode || undefined,
    isActive: values.isActive,
    imageUrl: values.imageUrl || undefined,
    smallImageUrl: values.smallImageUrl || undefined,
    mediumImageUrl: values.mediumImageUrl || undefined,
    largeImageUrl: values.largeImageUrl || undefined,
    trackLot: values.isTrackable,
    trackExpiry: values.isTrackable,
    priceListItems: priceListEntries,
    stockItems,
  };
}
