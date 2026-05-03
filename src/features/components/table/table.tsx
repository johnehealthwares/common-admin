import {
  Table,
  Badge,
  Text,
  Loader,
  Center,
} from '@mantine/core'

import { Column, FilterValue } from '../../rxsoft/types'
import { ActionCell, ActionCellProps } from '../action-cell'
import { TableHeader } from './table-header'
import { useState } from 'react'
import { renderCellValue } from './utils'


type DataTableProps = {
  columns: Column[]
  rows: Record<string, unknown>[]
  isLoading: boolean
  errorLoading: boolean
  actionCellProps?: ActionCellProps
  appliedFilters: Record<string, FilterValue | null>
  applyColumnFilter: (columnKey: string, filterValue: FilterValue | null) => void 
}

export const DataTable = ({
  columns,
  actionCellProps,
  rows,
  isLoading,
  errorLoading,
  appliedFilters,
  applyColumnFilter
}: DataTableProps) => {
  const colSpan = columns.length + (actionCellProps ? 1 : 0)


  return (
    <Table striped highlightOnHover withTableBorder>
      <Table.Thead>
        <Table.Tr>
          {columns.map((column) => (
            <Table.Th key={column.key}>
              <TableHeader  column={column} filterValue={appliedFilters[column.key]} onFilterValueChange={(filterValue) => {applyColumnFilter(column.key, filterValue)}}/>
            </Table.Th>
          ))}

          {actionCellProps && (
            <Table.Th style={{ width: 140 }}>
              Actions
            </Table.Th>
          )}
        </Table.Tr>
      </Table.Thead>

      <Table.Tbody>
        {isLoading && (
          <Table.Tr>
            <Table.Td colSpan={colSpan}>
              <Center>
                <Loader size="sm" />
              </Center>
            </Table.Td>
          </Table.Tr>
        )}

        {errorLoading && (
          <Table.Tr>
            <Table.Td colSpan={colSpan}>
              <Text c="red" ta="center">
                Failed to load data
              </Text>
            </Table.Td>
          </Table.Tr>
        )}

        {!isLoading && !errorLoading && rows.length === 0 && (
          <Table.Tr>
            <Table.Td colSpan={colSpan}>
              <Text c="dimmed" ta="center">
                No records found.
              </Text>
            </Table.Td>
          </Table.Tr>
        )}

        {rows.map((row: any, index: number) => (
          <Table.Tr key={String(row.id ?? index)}>
            {columns.map((column) => (
              <Table.Td key={column.key}>
                {column.render
                  ? column.render(row)
                  : renderCellValue(row[column.key])}
              </Table.Td>
            ))}

            {actionCellProps && (
              <Table.Td>
                <ActionCell {...actionCellProps} row={row} />
              </Table.Td>
            )}
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  )
}