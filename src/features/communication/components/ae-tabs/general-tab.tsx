import { Badge, Grid, Group, Stack, TextInput, Textarea } from '@mantine/core'
import { SelectField } from '@/features/components/form/select'
import { AE_STATUS_OPTIONS, PROTOCOL_TYPE_OPTIONS } from '../../types/constants'
import { DialogActions, LabelField } from '../shared'
import { AEFormState } from '../application-entities'

type Props = {
  formState: AEFormState
  setFormState: React.Dispatch<React.SetStateAction<AEFormState>>
  updateField: (field: string, value: any) => void
}

export function GeneralTab({ formState, setFormState }: Props) {
  return (
    <Stack gap="md" py="md">
      <TextInput
        label="AE Name"
        placeholder="e.g., Hospital XYZ"
        value={formState.name}
        onChange={(e) => setFormState((p) => ({ ...p, name: e.target.value }))}
        required
      />

      <Textarea
        label="Description"
        placeholder="Describe the purpose and role of this AE"
        value={formState.description}
        onChange={(e) => setFormState((p) => ({ ...p, description: e.target.value }))}
      />

      <Grid>
        <Grid.Col span={6}>
          <TextInput
            label="Facility Code"
            placeholder="e.g., FAC001"
            value={formState.facilityCode}
            onChange={(e) => setFormState((p) => ({ ...p, facilityCode: e.target.value }))}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Custom ID"
            placeholder="e.g., CUSTOM123"
            value={formState.customId}
            onChange={(e) => setFormState((p) => ({ ...p, customId: e.target.value }))}
          />
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={6}>
          <TextInput
            label="Facility ID"
            value={formState.facilityId}
            onChange={(e) => setFormState((p) => ({ ...p, facilityId: e.target.value }))}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Facility Name"
            value={formState.facilityName}
            onChange={(e) => setFormState((p) => ({ ...p, facilityName: e.target.value }))}
          />
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={6}>
          <TextInput
            label="Organization ID"
            value={formState.organizationId}
            onChange={(e) => setFormState((p) => ({ ...p, organizationId: e.target.value }))}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <SelectField
            label="Status"
            options={AE_STATUS_OPTIONS}
            value={formState.status}
            onChange={(v) => setFormState((p) => ({ ...p, status: v }))}
          />
        </Grid.Col>
      </Grid>

      <LabelField label="Inbound Capabilities" required>
        <SelectField
          label=""
          options={PROTOCOL_TYPE_OPTIONS}
          value={formState.inboundCapabilities?.length ? formState.inboundCapabilities[0] : ''}
          onChange={(v) => {
            if (v && !formState.inboundCapabilities.includes(v)) {
              setFormState((p) => ({
                ...p,
                inboundCapabilities: [...p.inboundCapabilities, v],
              }))
            }
          }}
          placeholder="Add inbound protocol"
        />
        <Group gap="xs">
          {formState.inboundCapabilities.map((cap) => (
            <Badge
              key={cap}
              rightSection={
                <button
                  onClick={() =>
                    setFormState((p) => ({
                      ...p,
                      inboundCapabilities: p.inboundCapabilities.filter((c) => c !== cap),
                    }))
                  }
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'inherit',
                    cursor: 'pointer',
                    padding: '0 2px',
                  }}
                >
                  ×
                </button>
              }
            >
              {cap}
            </Badge>
          ))}
        </Group>
      </LabelField>

      <LabelField label="Outbound Capabilities" required>
        <SelectField
          label=""
          options={PROTOCOL_TYPE_OPTIONS}
          value={formState.outboundCapabilities[0] || ''}
          onChange={(v) => {
            if (v && !formState.outboundCapabilities.includes(v)) {
              setFormState((p) => ({
                ...p,
                outboundCapabilities: [...p.outboundCapabilities, v],
              }))
            }
          }}
          placeholder="Add outbound protocol"
        />
        <Group gap="xs">
          {formState.outboundCapabilities.map((cap) => (
            <Badge
              key={cap}
              rightSection={
                <button
                  onClick={() =>
                    setFormState((p) => ({
                      ...p,
                      outboundCapabilities: p.outboundCapabilities.filter((c) => c !== cap),
                    }))
                  }
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'inherit',
                    cursor: 'pointer',
                    padding: '0 2px',
                  }}
                >
                  ×
                </button>
              }
            >
              {cap}
            </Badge>
          ))}
        </Group>
      </LabelField>

    </Stack>
  )
}