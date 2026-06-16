import { Drawer, Loader, NumberInput, Radio, Select, Stack, Switch, TextInput, useMantineColorScheme } from '@mantine/core';
import { useUserPosConfig, useUpdateUserPosConfig } from '../../api/posApi';

interface Props {
  opened: boolean;
  onClose: () => void;
}

export function PosSettingsDrawer({ opened, onClose }: Props) {
  const { toggleColorScheme } = useMantineColorScheme();
  const { data: config, isLoading } = useUserPosConfig();
  const updateConfig = useUpdateUserPosConfig();

  if (isLoading) {
    return (
      <Drawer opened={opened} onClose={onClose} title="POS Settings" position="right">
        <Loader />
      </Drawer>
    );
  }

  return (
    <Drawer opened={opened} onClose={onClose} title="POS Settings" position="right">
      <Stack>
        <Switch label="Auto Print" defaultChecked />

        <Switch label="Show Stock" defaultChecked />

        <Switch label="Expiry Warning" defaultChecked />

        <Switch label="Toggle Theme" onClick={() => toggleColorScheme()} defaultChecked />

        <Switch
          label="Allow POS"
          checked={config?.allowPos ?? true}
          onChange={(e) =>
            updateConfig.mutate({ allowPos: e.currentTarget.checked })
          }
        />

        <Switch
          label="Allow A4 Print (Wholesale)"
          checked={config?.allowA4Print ?? false}
          onChange={(e) =>
            updateConfig.mutate({ allowA4Print: e.currentTarget.checked })
          }
        />

        <TextInput
          label="Store ID"
          placeholder="default"
          value={config?.storeId ?? ''}
          onChange={(e) => updateConfig.mutate({ storeId: e.currentTarget.value || null })}
        />

        <Select
          label="Stock Location"
          placeholder="Select stock location"
          value={config?.stockLocationId}
          data={[]}
          clearable
          searchable
          nothingFoundMessage="No locations found"
          onChange={(value) => updateConfig.mutate({ stockLocationId: value })}
        />

        <NumberInput
          label="Login Timeout (minutes)"
          value={config?.loginTimeoutMinutes ?? 480}
          onChange={(v) => updateConfig.mutate({ loginTimeoutMinutes: v ? Number(v) : null })}
          min={1}
          max={1440}
        />

        <Radio.Group label="Tab Position" defaultValue="top">
          <Stack gap="xs">
            <Radio value="top" label="Top" />
            <Radio value="bottom" label="Bottom" />
          </Stack>
        </Radio.Group>
      </Stack>
    </Drawer>
  );
}
