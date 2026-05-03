import { Alert, Stack } from '@mantine/core'
import { AlertCircle } from 'lucide-react'
import { JsonEditorField } from '@/features/components/json-editor-field'
import { DialogActions } from '../shared'
import { AEFormState } from '../application-entities'

type Props = {
  formState: AEFormState
  updateField: (field: string, value: any) => void

}

export function InboundTab({ formState, updateField}: Props) {
  return (
    <Stack gap="md" py="md">
      <Alert icon={<AlertCircle size={16} />} title="Inbound Configuration" color="blue">
        Configure how external systems send data to this AE
      </Alert>
      <JsonEditorField
        label="Inbound Protocol Configurations"
        value={formState.inboundConfig}
        onChange={(v) => updateField( 'inboundConfig', v )}
      />
    </Stack>
  )
}