
import {
  Equal,
  EqualNot,
  ChevronRight,
  ChevronLeft,
  Search,
  ListFilter,
  EyeOff,
  Calendar,
  CalendarDays,
  CalendarClock,
  CalendarRange,
} from 'lucide-react'
import { ComponentType, SVGProps } from 'react'
import { FormState } from 'react-hook-form'

export type SearchControlType = 'autocomplete' | 'select'

export type SearchConfig = {
  type: SearchControlType
  param?: string
  placeholder?: string
  debounceMs?: number
  endpoint?: string
  searchParam?: string
  minChars?: number
  valueKey?: string
  labelKey?: string
  staticParams?: Record<string, string | number | boolean>
  filters: Option[]
}
type IconType = ComponentType<SVGProps<SVGSVGElement>>
export enum FilterType {
  EQUALS = 'EQUALS',
  NOT_EQUALS = 'NOT_EQUALS',
  GREATER_THAN = 'GREATER_THAN',
  GREATER_THAN_OR_EQUAL = 'GREATER_THAN_OR_EQUAL',
  LESS_THAN = 'LESS_THAN',
  LESS_THAN_OR_EQUAL = 'LESS_THAN_OR_EQUAL',
  FUZZY_MATCH = 'FUZZY_MATCH',
  CONTAINS = 'CONTAINS',
  MISSING = 'MISSING',
  TODAY = 'TODAY',
  TOMMORROW = 'TOMMORROW',
  YESTERDAY = 'YESTERDAY',
  NEXT_24_HOURS = 'NEXT_24_HOURS',
  LAST_MONTH = 'LAST_MONTH',
  THIS_MONTH = 'THIS_MONTH',
  NEXT_MONTH = 'NEXT_MONTH',
  THIS_YEAR = 'THIS_YEAR',
  BETWEEN = 'BETWEEN',
}

export type ColumnFilter = {
  name: string,
  icon: IconType,
  type: FilterType,
  filterValue?: FilterValue
  option?: Option[]
}

export const FILTERS: Record<string, ColumnFilter> = {
  EQUALS: {
    name: 'Equals',
    icon: Equal,
    type: FilterType.EQUALS,
  },
  NOT_EQUALS: {
    name: 'Not equals',
    icon: EqualNot,
    type: FilterType.NOT_EQUALS,
  },
  GREATER_THAN: {
    name: 'Greater than',
    icon: ChevronRight,
    type: FilterType.GREATER_THAN,
  },
  GREATER_THAN_OR_EQUAL: {
    name: 'Greater than or equal',
    icon: ChevronRight,
    type: FilterType.GREATER_THAN_OR_EQUAL,
  },
  LESS_THAN: {
    name: 'Less than',
    icon: ChevronLeft,
    type: FilterType.LESS_THAN,
  },
  LESS_THAN_OR_EQUAL: {
    name: 'Less than or equal',
    icon: ChevronLeft,
    type: FilterType.LESS_THAN_OR_EQUAL,
  },

  FUZZY_MATCH: {
    name: 'Fuzzy match',
    icon: Search,
    type: FilterType.FUZZY_MATCH,
  },
  CONTAINS: {
    name: 'Contains',
    icon: ListFilter,
    type: FilterType.CONTAINS,
  },
  MISSING: {
    name: 'Missing',
    icon: EyeOff,
    type: FilterType.MISSING,
  },
  BETWEEN: {
    name: 'Between',
    icon: EyeOff,
    type: FilterType.BETWEEN,
  },

  TODAY: {
    name: 'Today',
    icon: Calendar,
    type: FilterType.TODAY,
  },
  TOMMORROW: {
    name: 'Tomorrow',
    icon: CalendarDays,
    type: FilterType.TOMMORROW,
  },
  YESTERDAY: {
    name: 'Yesterday',
    icon: CalendarClock,
    type: FilterType.YESTERDAY,
  },

  NEXT_24_HOURS: {
    name: 'Next 24 hours',
    icon: CalendarClock,
    type: FilterType.NEXT_24_HOURS,
  },

  LAST_MONTH: {
    name: 'Last month',
    icon: CalendarRange,
    type: FilterType.LAST_MONTH,
  },
  THIS_MONTH: {
    name: 'This month',
    icon: Calendar,
    type: FilterType.THIS_MONTH,
  },
  NEXT_MONTH: {
    name: 'Next month',
    icon: CalendarRange,
    type: FilterType.NEXT_MONTH,
  },
  THIS_YEAR: {
    name: 'This year',
    icon: Calendar,
    type: FilterType.THIS_YEAR,
  },
} as const

export const ColumnTypeFilters: Record<string, ColumnFilter[]>={
  STRING: [
    FILTERS.EQUALS, 
    FILTERS.NOT_EQUALS, 
    FILTERS.FUZZY_MATCH, 
    FILTERS.CONTAINS
  ],
  DATE: [
    FILTERS.EQUALS, 
    FILTERS.NOT_EQUALS, 
    FILTERS.GREATER_THAN, 
    FILTERS.GREATER_THAN_OR_EQUAL, 
    FILTERS.LESS_THAN, 
    FILTERS.LESS_THAN_OR_EQUAL, 
    FILTERS.TODAY, 
    FILTERS.TOMMORROW, 
    FILTERS.YESTERDAY, 
    FILTERS.NEXT_24_HOURS, 
    FILTERS.LAST_MONTH, 
    FILTERS.THIS_MONTH, 
    FILTERS.NEXT_MONTH, 
    FILTERS.THIS_YEAR,
    FILTERS.BETWEEN
  ],
  NUMBER: [
    FILTERS.EQUALS, 
    FILTERS.NOT_EQUALS, 
    FILTERS.GREATER_THAN, 
    FILTERS.GREATER_THAN_OR_EQUAL, 
    FILTERS.LESS_THAN, 
    FILTERS.LESS_THAN_OR_EQUAL
  ],
  BOOLEAN: [
    FILTERS.EQUALS, 
    FILTERS.NOT_EQUALS
  ]
}

export enum ColumnDataType {
  STRING,
  DATE,
  DATETIME,
  NUMBER,
  BOOLEAN
}
export type Column = {
  key: string
  label: string
  render?: (row: Record<string, unknown>) => React.ReactNode
  dataType?: ColumnDataType
  filters?: ColumnFilter[]
}


export type FilterValue = {
  filter: ColumnFilter
  value?: any
  valueTo?: any // for BETWEEN
}


export type Field = {
  name: string
  label: string
  type?:
  | 'text'
  | 'password'
  | 'switch'
  | 'async-select'
  | 'select'
  | 'number'
  | 'email'
  | 'hidden'
  | 'json'
  editable?: boolean
  placeholder?: string
  endpoint?: string
  searchParam?: string
  minChars?: number
  required?: boolean
  col?: number
  defaultValue?: unknown
  valueKey?: string
  labelKey?: string
  options?: Option[]
}

export type FieldGroup = {
  title?: string
  fields: Field[]
}

export type Option = {
  value: string
  label: string
}

export type TabGroup = {
  value: string
  title: string
  fields?: Field[]
  fieldGroups?: FieldGroup[]
  render?: (args: {
    formState: any
    updateField: (name: string, value: unknown) => void
  }) => React.ReactNode
}

export type Pagination = {
  pageIndex: number
  pageSize: number
  total: number
}

export type DataPageShellProps = {
  title: string
  description?: string
  endpoint: string
  columns: Column[]
  modalTitle?: string
  createFields?: Field[]
  createFieldGroups?: FieldGroup[]
  tabGroups?: TabGroup[]
  sortOptions?: Option[]
  formState?: Record<string, unknown>
  updateField?: (name: string, value: unknown) => void
  searchConfig?: SearchConfig
  buildCreatePayload?: (values: Record<string, unknown>) => unknown
  buildUpdatePayload?: (
    values: Record<string, unknown>,
    row: Record<string, unknown>
  ) => unknown
  canArchive?: boolean
  canDelete?: boolean
  canExport?: boolean
  csvEndpoint?: string
  detailPathBuilder?: (row: Record<string, unknown>) => string
  editPathBuilder?: (row: Record<string, unknown>) => string
  deletePathBuilder?: (row: Record<string, unknown>) => string
  embedded?: boolean
  renderCreateExtras?: (args: {
    formState: Record<string, unknown>
    updateField: (name: string, value: unknown) => void
  }) => React.ReactNode
  onCreateSuccess?: (
    created: Record<string, unknown>,
    values: Record<string, unknown>
  ) => Promise<void> | void
}

export type SearchOption = {
  label: string
  value: string
}


export type DailySale = {
  day: string
  salesCount: number
  totalAmount: number
}

export type InventoryValuation = {
  itemsCount: number
  totalQuantity: number
}

export type TopProduct = {
  productCode: string
  quantitySold: number
  revenue: number
}
