import { Button, Stack, Text, Title, Center, Group } from '@mantine/core';

export function MaintenanceError() {
  return (
    <Center style={{ height: '100vh', width: '100%' }}>
      <Stack align="center" gap="xs">
        <Title order={1} size="6rem">
          503
        </Title>

        <Text fw={500}>Website is under maintenance!</Text>

        <Text size="sm" c="dimmed" ta="center">
          The site is not available at the moment. <br />
          We'll be back online shortly.
        </Text>

        <Group mt="md">
          <Button variant="outline">Learn more</Button>
        </Group>
      </Stack>
    </Center>
  );
}
