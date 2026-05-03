import {
  ActionIcon,
  Group,
  Menu,
  TextInput,
  Modal,
  NumberInput,
  Stack,
  Button,
} from '@mantine/core'

import { DatePickerInput, DateTimePicker } from '@mantine/dates'
import { SlidersHorizontal } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Column, ColumnDataType, ColumnFilter, FilterType, FilterValue } from '../../rxsoft/types'
import { resolveAutoFilterValue } from './utils'

export const TableHeader = ({
  column: { label, dataType, filters },
  filterValue,
  onFilterValueChange,
}: {
  column: Column
  filterValue: FilterValue | null
  onFilterValueChange: (filterValue: FilterValue | null) => void
}) => {

  const [open, setOpen] = useState(false)
  const [menuOpened, setMenuOpened] = useState(false)
  const [tempFilter, setTempFilter] = useState<FilterValue | null>(filterValue)



  // ------------------------
  // HANDLE FILTER CLICK
  // ------------------------
  const handleFiltering = (filter: ColumnFilter) => {
    setMenuOpened(false) // ✅ close immediately

    const auto = resolveAutoFilterValue(filter)

    // ✅ AUTO FILTER → apply instantly
    if (auto) {
      onFilterValueChange(auto)
      return
    }

    // ❌ NEED INPUT → open modal
    setTempFilter({ filter, value: '', valueTo: '' })
    setOpen(true)
  }



  // ------------------------
  // APPLY BUTTON
  // ------------------------
  const handleApply = () => {
    onFilterValueChange(tempFilter)
    // setTempFilter(null)
    setOpen(false)
  }

  // ------------------------
  // UI
  // ------------------------
  return (
    <>
      <Group gap="xs">
        {label}

        {filters && filters?.length > 0 && (
          <Menu shadow="md" width={220}
            opened={menuOpened}
            onChange={setMenuOpened}
          >
            <Menu.Target>
              <ActionIcon size="sm" variant="subtle">
                <SlidersHorizontal size={14} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              {filters?.map((filter) => (
                <Menu.Item
                  key={filter.type}
                  onClick={() => handleFiltering(filter)}
                >
                  {filter.name}
                </Menu.Item>
              ))}

              <Menu.Item
                color="red"
                onClick={() =>
                  onFilterValueChange(null)
                }
              >
                Clear filter
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </Group>

      {/* MODAL */}
      {tempFilter && <Modal
        opened={open}
        onClose={() => setOpen(false)}
        title={tempFilter?.filter.name}
      >
        <Stack>
          <FilterInput dataType={dataType} filterValue={tempFilter} updateFilter={setTempFilter} />

          <Button onClick={handleApply}>Apply</Button>
        </Stack>
      </Modal>}
    </>
  )
}


// ------------------------
// RENDER INPUT
// ------------------------
const FilterInput = ({ dataType, filterValue, updateFilter }: { dataType: any, filterValue: FilterValue, updateFilter: (filterValue: FilterValue | null) => void }) => {
  const isBetween = filterValue.filter.type === FilterType.BETWEEN
  const [value, setValue] = useState<string | null>(filterValue.value)
  const [valueTo, setValueTo] = useState<string | null>(filterValue.valueTo)

  useEffect(() => {
    updateFilter({
      ...filterValue,
      value,
      valueTo,
    })
  }, [value, valueTo])

  switch (dataType) {
    case ColumnDataType.NUMBER:
      return (
        <Stack>
          <NumberInput
            label={isBetween ? 'From' : 'Value'}
            value={value || ''}
            onChange={(v) => setValue(v as string)}
          />
          {isBetween && (
            <NumberInput
              label="To"
              value={valueTo || ''}
              onChange={(v) => setValue(v as string)}
            />
          )}
        </Stack>
      )

    case ColumnDataType.DATE:
      return (
        <Stack>
          <DatePickerInput
            label={isBetween ? 'From' : 'Date'}
            value={value}
            onChange={setValue}
          />
          {isBetween && (
            <DatePickerInput
              label="To"
              value={valueTo}
              onChange={setValueTo}
            />
          )}
        </Stack>
      )

    case ColumnDataType.DATETIME:
      return (
        <Stack>
          <DateTimePicker
            label={isBetween ? 'From' : 'Date'}
            value={value}
            onChange={setValue}
          />
          {isBetween && (
            <DateTimePicker
              label="To"
              value={valueTo}
              onChange={setValueTo}
            />
          )}
        </Stack>
      )

    default:
      return (
        <TextInput
          label="Value"
          value={value || ''}
          onChange={(e) =>
            setValue(e.currentTarget.value)
          }
        />
      )
  }
}
