import { Drawer, Radio, Stack, Switch, useMantineColorScheme } from '@mantine/core';

interface Props {
  opened: boolean;
  onClose: () => void;
}

export function PosSettingsDrawer({ opened, onClose }: Props) {
  const { toggleColorScheme } = useMantineColorScheme();
  return (
    <Drawer opened={opened} onClose={onClose} title="POS Settings" position="right">
      <Stack>
        <Switch label="Auto Print" defaultChecked />

        <Switch label="Show Stock" defaultChecked />

        <Switch label="Expiry Warning" defaultChecked />

        <Switch label="Toggle Theme" onClick={() => toggleColorScheme()} defaultChecked />

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
