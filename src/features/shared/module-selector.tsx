import { Select, Text, Paper, Group, Stack } from '@mantine/core'
import { modules, moduleMap, type ModuleId } from './module-data'
import { useModuleStore } from '@/stores/module-store'

export function ModuleSelector() {
  const selectedModule = useModuleStore((state) => state.selectedModule)
  const setSelectedModule = useModuleStore((state) => state.setSelectedModule)

  return (
    <Paper withBorder radius="md" p="sm">

      <Group justify="space-between" align="flex-start">

        {/* LEFT INFO */}
        <Stack gap={2}>
          <Text size="sm" fw={600}>
            Workspace
          </Text>

          <Text size="xs" c="dimmed">
            Select the module you want to sign in to.
          </Text>
        </Stack>

        {/* SELECT */}
        <Select
          value={selectedModule}
          onChange={(value) => value && setSelectedModule(value as ModuleId)}
          data={modules.map((m) => ({
            value: m.id,
            label: m.title,
          }))}
          w={200}
          size="sm"
        />

      </Group>

      {/* DESCRIPTION */}
      <Text size="xs" c="dimmed" mt="xs">
        {moduleMap[selectedModule].description}
      </Text>

    </Paper>
  )
}