import { Outlet } from '@tanstack/react-router'


import {
  ActionIcon,
  Box,
  Divider,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core'

import { Main } from '@/layout/main'
import { Bell, Palette, Settings2, UserCog, Monitor } from 'lucide-react'
import { SidebarNavItem } from '../components/sidebar-nav'

const sidebarNavItems = [
  {
    title: 'Profile',
    href: '/settings',
    icon: <UserCog size={18} />,
  },
  {
    title: 'Account',
    href: '/settings/account',
    icon: <Settings2 size={18} />,
  },
  {
    title: 'Appearance',
    href: '/settings/appearance',
    icon: <Palette size={18} />,
  },
  {
    title: 'Notifications',
    href: '/settings/notifications',
    icon: <Bell size={18} />,
  },
  {
    title: 'Display',
    href: '/settings/display',
    icon: <Monitor size={18} />,
  },
]

export function Settings() {
  return (
    <Main>
      {/* ===== Top Heading ===== */}
      <Stack gap="xs">
        <Title order={1}>Settings</Title>

        <Text c="dimmed">
          Manage your account settings and set e-mail preferences.
        </Text>
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
            {/* <SidebarNav items={sidebarNavItems} /> */}
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
  )
}