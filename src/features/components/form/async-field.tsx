import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import {
  Combobox,
  InputBase,
  useCombobox,
  Loader,
  Text,
} from '@mantine/core'
import { Field } from '@/features/rxsoft/types'
import { getArrayPayload, mapOption, useDebouncedValue } from '../utils'


export function AsyncSelectField({
  value,
  field,
  onChange,
  apiClient,
  disabled = false,
}: {
  value: string
  field: Field
  onChange: (value: string) => void
  apiClient: AxiosInstance
  disabled?: boolean
}) {
  const combobox = useCombobox()
  const [inputValue, setInputValue] = useState('')
  const [debouncedInput] = useDebouncedValue(inputValue, 300)

  const canSearch =
    debouncedInput.trim().length >= (field.minChars ?? 2)

  // Fetch selected item (label for current value)
  const { data: selectedItem } = useQuery({
    queryKey: ['async-selected', field.endpoint, value],
    queryFn: async () => {
      if (!field.endpoint || !value) return null

      const res = await apiClient.get(`${field.endpoint}/${value}`)

      const payload =
        res.data && typeof res.data === 'object' && 'data' in res.data
          ? res.data.data
          : res.data

      const item = getArrayPayload([payload])[0] ?? payload

      return mapOption(item, field.valueKey, field.labelKey)
    },
    enabled: Boolean(field.endpoint) && Boolean(value),
    staleTime: 30_000,
  })

  // sync input with selected value
  useEffect(() => {
    if (selectedItem?.label) {
      setInputValue(selectedItem.label)
    }
  }, [selectedItem])

  // search query
  const query = useQuery({
    queryKey: ['async-search', field.endpoint, debouncedInput],
    queryFn: async () => {
      if (!field.endpoint) return []

      const res = await apiClient.get(field.endpoint, {
        params: {
          [field.searchParam ?? 'q']: debouncedInput,
        },
      })

      return getArrayPayload(res.data)
        .map((item) => mapOption(item, field.valueKey, field.labelKey))
        .filter(Boolean)
    },
    enabled: Boolean(field.endpoint) && canSearch,
    staleTime: 30_000,
  })

  const options = query.data ?? []

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={(val) => {
        const selected = options.find((o) => o.value === val)
        if (selected) {
          onChange(selected.value)
          setInputValue(selected.label)
        }
        combobox.closeDropdown()
      }}
    >
      <Combobox.Target>
        <InputBase
          value={inputValue}
          disabled={disabled}
          placeholder={
            field.placeholder ??
            `Search ${field.label.toLowerCase()}...`
          }
          onChange={(event) => {
            setInputValue(event.currentTarget.value)
            combobox.openDropdown()
            combobox.updateSelectedOptionIndex()
          }}
          onFocus={() => combobox.openDropdown()}
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          {query.isLoading && (
            <Combobox.Empty>
              <Loader size="xs" /> Loading...
            </Combobox.Empty>
          )}

          {!query.isLoading && options.length === 0 && (
            <Combobox.Empty>
              <Text size="sm" c="dimmed">
                No results
              </Text>
            </Combobox.Empty>
          )}

          {options.map((option) => (
            <Combobox.Option key={option.value} value={option.value}>
              {option.label}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  )
}