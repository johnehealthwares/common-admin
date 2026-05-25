import { Select, Text, Paper, Group, Stack } from '@mantine/core'
import { modules, moduleMap, type ModuleId } from './module-data'
import { useModuleId, useSetSelectedModule } from '@/context/module-context'

export function ModuleSelector() {
  const selectedModule = useModuleId()
  const setSelectedModule = useSetSelectedModule()

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