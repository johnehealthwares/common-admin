
import {
  AppShell,
  Stack,
  ScrollArea,
  Box,
  Text,
  Divider,
  Badge,
  Group,
} from '@mantine/core'
import { useAuthStore } from '@/stores/auth-store'
import { useModuleStore } from '@/stores/module-store'
import { moduleMap } from '@/features/shared/module-data'
import { filterNavGroupsByModule, sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { TeamSwitcher } from './team-switcher'
import {  Plus, Search } from 'lucide-react'

export function AppSidebar() {
  // const { collapsible, variant } = useLayout()
  const user = useAuthStore((state) => state.user)
  const selectedModule = useModuleStore((state) => state.selectedModule)
  const filteredNavGroups = filterNavGroupsByModule(
    sidebarData.navGroups,
    selectedModule
  )
  const moduleDefinition = moduleMap[selectedModule]

  return (


  <AppShell.Navbar p="xs">
    <Stack h="100%" gap="xs">

      {/* 🔹 HEADER */}
      <Box>
        <Stack gap="xs">
          <TeamSwitcher teams={sidebarData.teams} />

          <Badge variant="light" radius="xl" px="sm">
  <Group gap={6}>
    <Text size="xs" fw={600}>
      {moduleDefinition.title}
    </Text>
    <Text size="9px" c="dimmed">
      module
    </Text>
  </Group>
</Badge>
        </Stack>
      </Box>
      

      <Divider />

      {/* 🔹 CONTENT (scrollable) */}
      <ScrollArea style={{ flex: 1 }}>
        <Stack gap="xs">
          {filteredNavGroups.map((props) => (
            <NavGroup key={props.title} items={props.items} />
          ))}
        </Stack>
      </ScrollArea>

      <Divider />

      {/* 🔹 FOOTER */}
      <Box>
        <NavUser
          user={{
            name: user?.username ?? 'RxSoft User',
            email: user?.roles?.join(', ') || 'No roles assigned',
            avatar: sidebarData.user.avatar,
          }}
        />
      </Box>

    </Stack>
  </AppShell.Navbar>

  )
}
