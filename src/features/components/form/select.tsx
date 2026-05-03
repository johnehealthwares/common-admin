import { Option } from '@/features/rxsoft/types'
import { Select, Text } from '@mantine/core'

type SelectFieldProps = {
  value: string
  options: Option[]
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  className?: string
  disabled?: boolean
}

export function SelectField({
  value,
  options,
  onChange,
  placeholder,
  label,
  className,
  disabled,
}: SelectFieldProps) {
  return (
    <div className={className ?? 'w-full'}>
      <Select
        label={label}
        value={value}
        onChange={(val) => onChange(val ?? '')}
        data={options.map((option) => ({
          value: option.value,
          label: option.label,
        }))}
        placeholder={placeholder}
        disabled={disabled}
        clearable
        searchable
      />
    </div>
  )
}