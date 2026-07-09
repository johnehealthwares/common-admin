import { ActionIcon, Box, Divider, Group, Stack, Text, Title } from '@mantine/core';
import { Outlet } from '@tanstack/react-router';
import { Bell, Palette, Settings2, UserCog, Monitor } from 'lucide-react';
import { Main } from '@/layout/main';
import { SidebarNavItem } from '../components/sidebar-nav';

const sidebarNavItems = [
  {
    title: 'Profile',
    url: '/settings',
    icon: UserCog,
  },
  {
    title: 'Account',
    url: '/settings/account',
    icon: Settings2,
  },
  {
    title: 'Appearance',
    url: '/settings/appearance',
    icon: Palette,
  },
  {
    title: 'Notifications',
    url: '/settings/notifications',
    icon: Bell,
  },
  {
    title: 'Display',
    url: '/settings/display',
    icon: Monitor,
  },
];
export function Settings() {
  return (
    <Main>
      {/* ===== Top Heading ===== */}
      <Stack gap="xs">
        <Title order={1}>Settings</Title>

        <Text c="dimmed">Manage your account settings and set e-mail preferences.</Text>
      </Stack>

      <Divider my="md" />

      <Box
        style={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
          gap: '2rem',
          flexDirection: 'column',
        }}
      >
        {/* Mobile / Tablet */}
        <Box hiddenFrom="lg">
          {/* {sidebarNavItems.map((item) => (<SidebarNavItem key={item.title} item={sidebarNavItems} />)} */}
        </Box>

        {/* Desktop */}
        <Group
          align="flex-start"
          gap="xl"
          wrap="nowrap"
          visibleFrom="lg"
          style={{
            flex: 1,
            overflow: 'hidden',
          }}
        >
          <Box
            style={{
              width: '20%',
              position: 'sticky',
              top: 0,
            }}
          >
            {sidebarNavItems.map((item, i) => (
              <SidebarNavItem
                key={item.title}
                pathname={item.title}
                expanded={false}
                index={i}
                item={item}
                resetExpandState={() => 2}
              />
            ))}
            {/* <SidebarNav items={sidebarNavItems} />}*/}
          </Box>

          <Box
            style={{
              flex: 1,
              overflow: 'hidden',
              padding: '0.25rem',
            }}
          >
            <Outlet />
          </Box>
        </Group>

        {/* Mobile Outlet */}
        <Box hiddenFrom="lg">
          <Outlet />
        </Box>
      </Box>
    </Main>
  );
}
