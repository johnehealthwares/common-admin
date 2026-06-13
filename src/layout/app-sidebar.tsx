import { AppShell, Stack, ScrollArea, Box, Divider, Badge, Group, Text } from '@mantine/core';
import { useState } from 'react';
import { useModuleId, useModuleName } from '@/context/module-context';
import { SidebarNavItem } from '@/features/settings/components/sidebar-nav';
import { useAuthStore } from '@/stores/auth-store';
import { filterNavGroupsByModule, sidebarData } from './data/sidebar-data';
import { NavUser } from './nav-user';
import { TeamSwitcher } from './team-switcher';

export function AppSidebar() {
  const user = useAuthStore((state) => state.user);
  const moduleId = useModuleId();
  const moduleName = useModuleName();

  const navGroups = filterNavGroupsByModule(sidebarData.navGroups, moduleId);
  const [expandState, setExpandState] = useState<boolean[]>(sidebarData.navGroups.map(() => false));

  const resetExpandState = (index: number, espanded: boolean) => {
    setExpandState(sidebarData.navGroups.map((_, inde) => {
     const unespanded =  inde === index ? !espanded : false
     return unespanded
    }));
  };

  return (
    <AppShell.Navbar
      p="sm"
      w={{ base: 250 }}
      style={{
        borderRight: '1px solid var(--mantine-color-gray-3)',
      }}
    >
      <Stack h="100%" gap="sm">
        {/* HEADER */}
        <Box>
          <Stack gap="md">
            <TeamSwitcher />

            <Badge
              variant="light"
              radius="xl"
              size="lg"
              styles={{
                root: {
                  width: 'fit-content',
                },
              }}
            >
              <Group gap={6}>
                <Text size="xs" fw={700}>
                  {moduleName}
                </Text>

                <Text size="10px" c="dimmed">
                  module
                </Text>
              </Group>
            </Badge>
          </Stack>
        </Box>

        <Divider />

        {/* NAVIGATION */}
        <ScrollArea flex={1} scrollbarSize={0}>
          {navGroups.map((item, i) => (
            <SidebarNavItem
              key={item.title}
              item={item}
              pathname={'pathname'}
              resetExpandState={resetExpandState}
              expanded={expandState[i]}
              index={i}
              collapsed={false}
            />
          ))}
        </ScrollArea>

        <Divider />

        {/* FOOTER */}
        <NavUser
          user={{
            name: user?.username ?? 'RxSoft User',
            email: user?.roles?.join(', ') ?? 'No roles assigned',
            avatar: sidebarData.user.avatar,
          }}
        />
      </Stack>
    </AppShell.Navbar>
  );
}
