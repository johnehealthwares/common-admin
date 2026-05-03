import { useState } from 'react'
import { Button, Checkbox, Group, Popover, Text } from '@mantine/core'
import { ChevronsUpDown } from 'lucide-react'

import { Option } from '../../rxsoft/types'

type MultiSelectFieldProps = {
  value: string[]
  options: Option[]
  onChange: (value: string[]) => void
  placeholder: string
  triggerClassName?: string
}

export function MultiSelectField({
  value,
  options,
  onChange,
  placeholder,
}: MultiSelectFieldProps) {
  const [opened, setOpened] = useState(false)

  const toggleValue = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val))
    } else {
      onChange([...value, val])
    }
  }

  const selectedLabels = options
    .filter((o) => value.includes(o.value))
    .map((o) => o.label)

  return (
    <Popover opened={opened} onChange={setOpened} position="bottom-start" width="target">
      <Popover.Target>
        <Button
          variant="default"
          onClick={() => setOpened((o) => !o)}
          rightSection={<ChevronsUpDown size={16} />}
          styles={{
            root: {
              justifyContent: 'space-between',
            },
          }}
        >
          <Text size="sm" c={selectedLabels.length ? 'black' : 'dimmed'}>
            {selectedLabels.length > 0
              ? selectedLabels.join(', ')
              : placeholder}
          </Text>
        </Button>
      </Popover.Target>

      <Popover.Dropdown>
        <Group gap="xs">
          {options.map((option) => (
            <Checkbox
              key={option.value}
              label={option.label}
              checked={value.includes(option.value)}
              onChange={() => toggleValue(option.value)}
            />
          ))}
        </Group>
      </Popover.Dropdown>
    </Popover>
  )
}