import { Alert, Stack, TextInput } from '@mantine/core'
import { AlertCircle } from 'lucide-react'
import { SelectField } from '@/features/components/form/select'
import { TLS_VERSION_OPTIONS } from '../../types/constants'
import { DialogActions } from '../shared'
import { AEFormState } from '../application-entities'

type Props = {
  formState: AEFormState
  setFormState: React.Dispatch<React.SetStateAction<AEFormState>>
  updateField: (field: string, value: any) => void
}

export function SecurityTab({ formState, setFormState }: Props) {
  return (
    <Stack gap="md" py="md">
      <Alert icon={<AlertCircle size={16} />} title="Security Settings" color="yellow">
        Configure TLS and authentication settings for secure communication
      </Alert>
      <div>
        <input
          type="checkbox"
          id="tlsEnabled"
          checked={formState.securitySettings.tlsEnabled}
          onChange={(e) =>
            setFormState((p) => ({
              ...p,
              securitySettings: { ...p.securitySettings, tlsEnabled: e.target.checked },
            }))
          }
        />
        <label htmlFor="tlsEnabled" style={{ marginLeft: '8px' }}>
          Enable TLS
        </label>
      </div>

      {formState.securitySettings.tlsEnabled && (
        <>
          <SelectField
            label="TLS Version"
            options={TLS_VERSION_OPTIONS}
            value={formState.securitySettings.tlsVersion || ''}
            onChange={(v) =>
              setFormState((p) => ({
                ...p,
                securitySettings: { ...p.securitySettings, tlsVersion: v },
              }))
            }
          />

          <TextInput
            label="Certificate Path"
            value={formState.securitySettings.certificatePath || ''}
            onChange={(e) =>
              setFormState((p) => ({
                ...p,
                securitySettings: { ...p.securitySettings, certificatePath: e.target.value },
              }))
            }
          />

          <TextInput
            label="Private Key Path"
            value={formState.securitySettings.privateKeyPath || ''}
            onChange={(e) =>
              setFormState((p) => ({
                ...p,
                securitySettings: { ...p.securitySettings, privateKeyPath: e.target.value },
              }))
            }
          />

          <TextInput
            label="CA Path"
            value={formState.securitySettings.caPath || ''}
            onChange={(e) =>
              setFormState((p) => ({
                ...p,
                securitySettings: { ...p.securitySettings, caPath: e.target.value },
              }))
            }
          />

          <div>
            <input
              type="checkbox"
              id="acceptSelfSigned"
              checked={formState.securitySettings.acceptSelfSigned}
              onChange={(e) =>
                setFormState((p) => ({
                  ...p,
                  securitySettings: { ...p.securitySettings, acceptSelfSigned: e.target.checked },
                }))
              }
            />
            <label htmlFor="acceptSelfSigned" style={{ marginLeft: '8px' }}>
              Accept Self-Signed Certificates
            </label>
          </div>
        </>
      )}

    </Stack>
  )
}