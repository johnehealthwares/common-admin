import { Stack } from '@mantine/core'
import { JsonEditorField } from '@/features/components/json-editor-field'
import { DialogActions } from '../shared'
import { AEFormState } from '../application-entities'

type Props = {
  formState: AEFormState
  setFormState: React.Dispatch<React.SetStateAction<AEFormState>>
  updateField: (field: string, value: any) => void

}

export function AttributesTab({ formState, setFormState }: Props) {
  return (
    <Stack gap="md" py="md">
      <JsonEditorField
        label="Custom Attributes"
        value={formState.attributes || {}}
        onChange={(v) => setFormState((p) => ({ ...p, attributes: v as Record<string, unknown> }))}
      />
    </Stack>
  )
}