import * as React from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  Menu,
  UnstyledButton,
  Group,
  Stack,
  Text,
  Box,
} from '@mantine/core'
import { ChevronsUpDown, Plus } from 'lucide-react'

import { getModuleDashboard } from '@/lib/module-routing'
import { useModuleStore } from '@/stores/module-store'
import type { ModuleId } from '@/features/shared/module-data'

type TeamSwitcherProps = {
  teams: {
    name: string
    logo: React.ElementType
    plan: string
    moduleId: ModuleId
  }[]
}

export function TeamSwitcher({ teams }: TeamSwitcherProps) {
  const navigate = useNavigate()
  const selectedModule = useModuleStore((s) => s.selectedModule)
  const setSelectedModule = useModuleStore((s) => s.setSelectedModule)

  const activeTeam =
    teams.find((t) => t.moduleId === selectedModule) ?? teams[0]

  return (
    <Menu
      width={220}
      position="right-start"
      offset={6}
    >
      {/* 🔹 Trigger (Sidebar button) */}
      <Menu.Target>
        <UnstyledButton
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: 8,
          }}
        >
          <Group gap="sm">
            {/* Logo */}
            <Box
              style={{
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 8,
                background: 'var(--mantine-color-blue-6)',
                color: 'white',
              }}
            >
              <activeTeam.logo size={16} />
            </Box>

            {/* Text */}
            <Stack gap={0} style={{ flex: 1 }}>
              <Text size="sm" fw={600} truncate>
                {activeTeam.name}
              </Text>
              <Text size="xs" c="dimmed" truncate>
                {activeTeam.plan}
              </Text>
            </Stack>

            <ChevronsUpDown size={16} />
          </Group>
        </UnstyledButton>
      </Menu.Target>

      {/* 🔹 Dropdown */}
      <Menu.Dropdown>
        <Menu.Label>Teams</Menu.Label>

        {teams.map((team, index) => (
          <Menu.Item
            key={team.name}
            onClick={() => {
              setSelectedModule(team.moduleId as any)
              navigate({ to: getModuleDashboard(team.moduleId) })
            }}
            leftSection={<team.logo size={14} />}
            rightSection={
              <Text size="xs" c="dimmed">
                ⌘{index + 1}
              </Text>
            }
          >
            {team.name}
          </Menu.Item>
        ))}

        <Menu.Divider />

        <Menu.Item
          leftSection={<Plus size={14} />}
          c="dimmed"
        >
          Add team
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}