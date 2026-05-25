import {
  AppShell,
  Group,
  Button,
  Card,
  Text,
  Title,
  Tabs,
  SimpleGrid,
  Stack,
  Divider,
} from '@mantine/core'

// import { ConfigDrawer } from '@/components/config-drawer'
// import { ProfileDropdown } from '@/components/profile-dropdown'
// import { Search } from '@/components/search'
// import { ThemeSwitch } from '@/components/theme-switch'

import { Analytics } from '../components/analytics'
import { Overview } from '../components/overview'
// import { RecentSales } from '../components/recent-sales'

export function Dashboard() {
  return (
    <AppShell
      header={{ height: 64 }}
      padding="md"
    >
      {/* ===== Header ===== */}
      <AppShell.Header>
        <Group justify="space-between" h="100%" px="md">
          <Group>
            <Title order={4}>Dashboard</Title>
          </Group>

          <Group gap="sm">
            {/* <Search />
            <ThemeSwitch />
            <ConfigDrawer />
            <ProfileDropdown /> */}
          </Group>
        </Group>
      </AppShell.Header>

      {/* ===== Main ===== */}
      <AppShell.Main>
        <Group justify="space-between" mb="md">
          <Title order={2}>Dashboard</Title>

          <Button>Download</Button>
        </Group>

        <Tabs defaultValue="overview">
          <Tabs.List mb="md">
            <Tabs.Tab value="overview">Overview</Tabs.Tab>
            <Tabs.Tab value="analytics">Analytics</Tabs.Tab>
            <Tabs.Tab value="reports" disabled>
              Reports
            </Tabs.Tab>
            <Tabs.Tab value="notifications" disabled>
              Notifications
            </Tabs.Tab>
          </Tabs.List>

          {/* ===== Overview ===== */}
          <Tabs.Panel value="overview">
            <Stack gap="md">
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
                <Card withBorder>
                  <Text size="sm" c="dimmed">
                    Total Revenue
                  </Text>
                  <Title order={3}>$45,231.89</Title>
                  <Text size="xs" c="dimmed">
                    +20.1% from last month
                  </Text>
                </Card>

                <Card withBorder>
                  <Text size="sm" c="dimmed">
                    Subscriptions
                  </Text>
                  <Title order={3}>+2350</Title>
                  <Text size="xs" c="dimmed">
                    +180.1% from last month
                  </Text>
                </Card>

                <Card withBorder>
                  <Text size="sm" c="dimmed">
                    Sales
                  </Text>
                  <Title order={3}>+12,234</Title>
                  <Text size="xs" c="dimmed">
                    +19% from last month
                  </Text>
                </Card>

                <Card withBorder>
                  <Text size="sm" c="dimmed">
                    Active Now
                  </Text>
                  <Title order={3}>+573</Title>
                  <Text size="xs" c="dimmed">
                    +201 since last hour
                  </Text>
                </Card>
              </SimpleGrid>

              <SimpleGrid cols={{ base: 1, lg: 7 }}>
                <Card withBorder style={{ gridColumn: 'span 4' }}>
                  <Title order={4} mb="md">
                    Overview
                  </Title>
                  <Overview />
                </Card>

                <Card withBorder style={{ gridColumn: 'span 3' }}>
                  <Title order={4}>Recent Sales</Title>
                  <Text size="sm" c="dimmed" mb="md">
                    You made 265 sales this month.
                  </Text>
                  {/* <RecentSales /> */}
                </Card>
              </SimpleGrid>
            </Stack>
          </Tabs.Panel>

          {/* ===== Analytics ===== */}
          <Tabs.Panel value="analytics">
            <Analytics />
          </Tabs.Panel>
        </Tabs>
      </AppShell.Main>
    </AppShell>
  )
}