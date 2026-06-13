import { Button, Stack, Text, Title, Center, Group } from '@mantine/core';
import { useNavigate, useRouter } from '@tanstack/react-router';

export function UnauthorisedError() {
  const navigate = useNavigate();
  const { history } = useRouter();

  return (
    <Center style={{ height: '100vh', width: '100%' }}>
      <Stack align="center" gap="xs">
        <Title order={1} size="6rem">
          401
        </Title>

        <Text fw={500}>Unauthorized Access</Text>

        <Text size="sm" c="dimmed" ta="center">
          Please log in with the appropriate credentials <br />
          to access this resource.
        </Text>

        <Group mt="md">
          <Button variant="outline" onClick={() => history.go(-1)}>
            Go Back
          </Button>

          <Button onClick={() => navigate({ to: '/' })}>Back to Home</Button>
        </Group>
      </Stack>
    </Center>
  );
}
