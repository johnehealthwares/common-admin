import { useEffect, useState } from "react"
import { SearchConfig, SearchOption } from "../rxsoft/types"
import { getArrayPayload, mapOption, useDebouncedValue } from "./utils"
import { QueryKey, useQuery } from "@tanstack/react-query"
import { rxsoftApi } from "@/lib/rxsoft-api"
import { SelectField } from "./select"
import { SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

function RemoteSelectField({
  config,
  value,
  onChange,
}: {
  config: SearchConfig
  value: string
  onChange: (value: string) => void
}) {
  const {
    type,
    endpoint,
    searchParam = 'q',
    placeholder = 'Search...',
    debounceMs = 300,
    minChars = 2,
    staticParams,
    valueKey,
    labelKey,
  } = config
  const [inputValue, setInputValue] = useState(value)
  const [showOptions, setShowOptions] = useState(false)
  const debouncedInput = useDebouncedValue(inputValue, debounceMs)
  const canSearch = debouncedInput.trim().length >= minChars

  useEffect(() => {
    setInputValue(value)
  }, [value])

  const query = useQuery({
    queryKey: [
      'rxsoft-search-control',
      type,
      endpoint,
      debouncedInput,
      staticParams,
    ] satisfies QueryKey,
    queryFn: async () => {
      if (!endpoint) return [] as SearchOption[]

      const response = await rxsoftApi.get(endpoint, {
        params:
          type === 'select'
            ? staticParams
            : {
              ...(staticParams ?? {}),
              [searchParam]: debouncedInput,
            },
      })

      return getArrayPayload(response.data)
        .map((item) => mapOption(item, valueKey, labelKey))
        .filter((item): item is SearchOption => item !== null)
    },
    enabled:
      Boolean(endpoint) && (type === 'select' || (type === 'autocomplete' && canSearch)),
    staleTime: 30_000,
  })

  if (type === 'select') {
    return (
      <SelectField
        value={value}
        options={query.data ?? []}
        onChange={onChange}
        placeholder={placeholder} 
      />
    )
  }
  return (
    <div className='relative'>
      <SearchIcon className='pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
      <Input
        className='ps-9'
        value={inputValue}
        placeholder={placeholder}
        onFocus={() => setShowOptions(true)}
        onBlur={() => {
          window.setTimeout(() => setShowOptions(false), 150)
        }}
        onChange={(event) => {
          const nextValue = event.target.value
          setInputValue(nextValue)
          onChange(nextValue)
        }}
      />
      {showOptions && (query.data?.length ?? 0) > 0 ? (
        <Card className='absolute top-[calc(100%+0.35rem)] z-30 max-h-60 w-full overflow-y-auto py-1'>
          <CardContent className='p-1'>
            {(query.data ?? []).map((option) => (
              <Button
                key={option.value}
                type='button'
                variant='ghost'
                className='h-auto w-full justify-start px-2 py-2 text-left'
                onClick={() => {
                  setInputValue(option.label)
                  onChange(option.label)
                  setShowOptions(false)
                }}
              >
                {option.label}
              </Button>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}

export {RemoteSelectField};