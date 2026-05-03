import { ColumnFilter, FilterType, FilterValue } from "@/features/rxsoft/types"
import { Badge, Text } from "@mantine/core"
import dayjs from "dayjs"



  // ------------------------
  // AUTO FILTER RESOLVER
  // ------------------------

export const resolveAutoFilterValue = (
  filter: ColumnFilter
): FilterValue | null => {
  const now = dayjs()

  const startOfDay = (d: dayjs.Dayjs) => d.startOf('day')
  const endOfDay = (d: dayjs.Dayjs) => d.endOf('day')

  const startOfMonth = (d: dayjs.Dayjs) => d.startOf('month')
  const endOfMonth = (d: dayjs.Dayjs) => d.endOf('month')

  const toISO = (d: dayjs.Dayjs) => d.toISOString()

  switch (filter.type) {
    case FilterType.TODAY:
      return {
        filter,
        value: toISO(startOfDay(now)),
        valueTo: toISO(endOfDay(now)),
      }

    case FilterType.YESTERDAY: {
      const d = now.subtract(1, 'day')
      return {
        filter,
        value: toISO(startOfDay(d)),
        valueTo: toISO(endOfDay(d)),
      }
    }

    case FilterType.TOMMORROW: {
      const d = now.add(1, 'day')
      return {
        filter,
        value: toISO(startOfDay(d)),
        valueTo: toISO(endOfDay(d)),
      }
    }

    case FilterType.NEXT_24_HOURS:
      return {
        filter,
        value: toISO(now),
        valueTo: toISO(now.add(24, 'hour')),
      }

    case FilterType.THIS_MONTH:
      return {
        filter,
        value: toISO(startOfMonth(now)),
        valueTo: toISO(endOfMonth(now)),
      }

    case FilterType.LAST_MONTH: {
      const d = now.subtract(1, 'month')
      return {
        filter,
        value: toISO(startOfMonth(d)),
        valueTo: toISO(endOfMonth(d)),
      }
    }

    case FilterType.NEXT_MONTH: {
      const d = now.add(1, 'month')
      return {
        filter,
        value: toISO(startOfMonth(d)),
        valueTo: toISO(endOfMonth(d)),
      }
    }

    case FilterType.THIS_YEAR:
      return {
        filter,
        value: toISO(now.startOf('year')),
        valueTo: toISO(now.endOf('year')),
      }

    default:
      return null
  }
}


export  function renderCellValue(value: unknown) {
    if (typeof value === 'boolean') {
      return (
        <Badge color={value ? 'blue' : 'gray'} variant="light">
          {String(value)}
        </Badge>
      )
    }
  
    if (value == null || value === '') {
      return (
        <Text c="dimmed" size="sm">
          -
        </Text>
      )
    }
  
    if (typeof value === 'object') {
      return (
        <Text size="xs" ff="monospace">
          {JSON.stringify(value)}
        </Text>
      )
    }
  
    return <Text size="sm">{String(value)}</Text>
  }