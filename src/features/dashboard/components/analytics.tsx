import {
  Card,
  Text,
  Title,
  SimpleGrid,
  Stack,
  Group,
  Progress,
} from '@mantine/core'

import { AnalyticsChart } from './analytics-chart'

export function Analytics() {
  return (
    <Stack gap="md">
      {/* ===== Chart Card ===== */}
      <Card withBorder>
        <Stack gap={4}>
          <Title order={4}>Traffic Overview</Title>
          <Text size="sm" c="dimmed">
            Weekly clicks and unique visitors
          </Text>
        </Stack>

        <div style={{ paddingTop: 16 }}>
          <AnalyticsChart />
        </div>
      </Card>

      {/* ===== Stats ===== */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
        <Card withBorder>
          <Text size="sm" c="dimmed">
            Total Clicks
          </Text>
          <Title order={3}>1,248</Title>
          <Text size="xs" c="dimmed">
            +12.4% vs last week
          </Text>
        </Card>

        <Card withBorder>
          <Text size="sm" c="dimmed">
            Unique Visitors
          </Text>
          <Title order={3}>832</Title>
          <Text size="xs" c="dimmed">
            +5.8% vs last week
          </Text>
        </Card>

        <Card withBorder>
          <Text size="sm" c="dimmed">
            Bounce Rate
          </Text>
          <Title order={3}>42%</Title>
          <Text size="xs" c="dimmed">
            -3.2% vs last week
          </Text>
        </Card>

        <Card withBorder>
          <Text size="sm" c="dimmed">
            Avg. Session
          </Text>
          <Title order={3}>3m 24s</Title>
          <Text size="xs" c="dimmed">
            +18s vs last week
          </Text>
        </Card>
      </SimpleGrid>

      {/* ===== Lists ===== */}
      <SimpleGrid cols={{ base: 1, lg: 7 }}>
        <Card withBorder style={{ gridColumn: 'span 4' }}>
          <Title order={4}>Referrers</Title>
          <Text size="sm" c="dimmed" mb="md">
            Top sources driving traffic
          </Text>

          {/* <SimpleBarList
            items={[
              { name: 'Direct', value: 512 },
              { name: 'Product Hunt', value: 238 },
              { name: 'Twitter', value: 174 },
              { name: 'Blog', value: 104 },
            ]}
            color="blue"
            suffix=""
          /> */}
        </Card>

        <Card withBorder style={{ gridColumn: 'span 3' }}>
          <Title order={4}>Devices</Title>
          <Text size="sm" c="dimmed" mb="md">
            How users access your app
          </Text>

          {/* <SimpleBarList
            items={[
              { name: 'Desktop', value: 74 },
              { name: 'Mobile', value: 22 },
              { name: 'Tablet', value: 4 },
            ]}
            color="gray"
            suffix="%"
          /> */}
        </Card>
      </SimpleGrid>
    </Stack>
  )
}