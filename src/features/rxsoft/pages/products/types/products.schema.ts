import type {
} from '@/features/components/rx-page'
import type {
  PendingPriceListEntry,
  PendingStockEntry,
} from '../components/product-setup-components'
import { FieldGroup, SearchConfig } from '../../types'

export const productSearchConfig: SearchConfig = {
  type: 'autocomplete',
  param: 'search',
  placeholder: 'Search products...',
  debounceMs: 300,
  endpoint: '/products',
  searchParam: 'search',
  minChars: 2,
  valueKey: 'id',
  labelKey: 'name',
  filters: [
    { value: 'name', label: 'Name' },
    { value: 'genericName', label: 'Generic name' },
    { value: 'categoryName', label: 'Category' },
  ],
}

export const productCreateFieldGroups: FieldGroup[] = [
  {
    title: 'Classification',
    fields: [
      {
        name: 'categoryId',
        label: 'Category',
        type: 'async-select',
        endpoint: '/categories',
        searchParam: 'search',
        minChars: 2,
        col: 6,
        required: true,
      },
      {
        name: 'genericProductId',
        label: 'Generic Product',
        type: 'async-select',
        endpoint: '/generic-products',
        searchParam: 'search',
        minChars: 2,
        col: 6,
        required: true,
      },
    ],
  },
  {
    title: 'Basic Information',
    fields: [
      { name: 'name', label: 'Product Name (Brand/Variety)', required: true, col: 6 },
      { name: 'code', label: 'Code', required: true, col: 6 },
      { name: 'barcode', label: 'Barcode', col: 6 },
    ],
  },
  {
    title: 'Units of Measure',
    fields: [
      {
        name: 'baseUomId',
        label: 'Base UOM',
        type: 'async-select',
        endpoint: '/uoms',
        searchParam: 'search',
        minChars: 2,
        required: true,
        col: 4,
      },
      {
        name: 'purchaseUomId',
        label: 'Purchase UOM',
        type: 'async-select',
        endpoint: '/uoms',
        searchParam: 'search',
        minChars: 2,
        col: 4,
      },
      {
        name: 'saleUomId',
        label: 'Sale UOM',
        type: 'async-select',
        endpoint: '/uoms',
        searchParam: 'search',
        minChars: 2,
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
]

function hasNumericValue(value: unknown) {
  return value !== '' && value !== null && value !== undefined && Number.isFinite(Number(value))
}

export function buildProductCreatePayload(values: Record<string, unknown>) {
  const priceListEntries = ((values.priceListEntries as PendingPriceListEntry[] | undefined) ?? [])
    .filter((entry) => entry.priceListId && hasNumericValue(entry.unitPrice))
    .map((entry) => ({
      priceListId: entry.priceListId,
      locationId: entry.locationId || undefined,
      currencyCode: entry.currencyCode || 'NGN',
      unitPrice: Number(entry.unitPrice),
    }))

  const stockItems = ((values.stockEntries as PendingStockEntry[] | undefined) ?? [])
    .filter((entry) => entry.locationId && hasNumericValue(entry.quantity))
    .map((entry) => ({
      locationId: entry.locationId,
      deltaQuantity: Number(entry.quantity),
      reason: 'Initial stock setup from product creation',
    }))

  return {
    code: values.code,
    name: values.name,
    categoryId: values.categoryId,
    genericProductId: values.genericProductId,
    baseUomId: values.baseUomId,
    purchaseUomId: values.purchaseUomId || undefined,
    saleUomId: values.saleUomId || undefined,
    barcode: values.barcode || undefined,
    isActive: values.isActive,
    trackLot: values.isTrackable,
    trackExpiry: values.isTrackable,
    priceListItems: priceListEntries,
    stockItems,
  }
}
