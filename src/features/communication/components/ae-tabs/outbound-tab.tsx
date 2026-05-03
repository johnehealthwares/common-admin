import { Alert, Stack } from '@mantine/core'
import { AlertCircle } from 'lucide-react'
import { JsonEditorField } from '@/features/components/json-editor-field'
import { DialogActions } from '../shared'
import { AEFormState } from '../application-entities'

type Props = {
  formState: AEFormState
  setFormState: React.Dispatch<React.SetStateAction<AEFormState>>
  updateField: (field: string, value: any) => void

}

export function OutboundTab({ formState, setFormState }: Props) {
  return (
    <Stack gap="md" py="md">
      <Alert icon={<AlertCircle size={16} />} title="Outbound Configuration" color="blue">
        Configure how this AE sends data to external systems
      </Alert>
      <JsonEditorField
        label="Outbound Protocol Configurations"
        value={formState.outboundConfig}
        onChange={(v) => setFormState((p) => ({ ...p, outboundConfig: v as any }))}
      />
    </Stack>
  )
}