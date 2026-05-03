import { Field } from "@/features/rxsoft/types"
import { Input, Switch, Text } from "@mantine/core"
import { codingConceptApi } from "@/lib/coding-concept-api"
import { AsyncSelectField } from "./async-field"
import { SelectField } from "./select"

type Props = { field: Field, value: string, updateField: (name: string, value: any) => void, enabled: boolean }

export function RenderField({
  field,
  value,
  updateField,
  enabled,
}: Props) {
  const isDisabled = !enabled
console.log({
  field,
  value,
  updateField,
  enabled,
})
  if (field.type === 'switch') {
    return (
      <div className="flex items-center gap-3 rounded-lg border px-3 py-2">
        <Switch
          checked={Boolean(value)}
          disabled={isDisabled}
          onChange={(event) =>
            updateField(field.name, event.currentTarget.checked)
          }
        />
        <Text size="sm">{field.label}</Text>
      </div>
    )
  }

  if (field.type === 'async-select') {
    return (
      <AsyncSelectField
        field={field}
        value={value}
        disabled={isDisabled}
        onChange={(v) => updateField(field.name, v)}
        apiClient={codingConceptApi}
      />
    )
  }

  if (field.type === 'select') {
    return (
      <SelectField
        value={value}
        disabled={isDisabled}
        onChange={(v) => updateField(field.name, v)}
        placeholder={field.placeholder}
        options={field.options ?? []}
      />
    )
  }

  return (
    <Input
      value={value}
      disabled={isDisabled}
      onChange={(e) => updateField(field.name, e.currentTarget.value)}
    />
  )
}