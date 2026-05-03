import { useNavigate, useRouter } from '@tanstack/react-router'
import { Button, Stack, Text, Title, Center, Group } from '@mantine/core'

export function ForbiddenError() {
  const navigate = useNavigate()
  const { history } = useRouter()

  return (
    <Center style={{ height: '100vh', width: '100%' }}>
      <Stack align="center" gap="xs">

        <Title order={1} size="6rem">
          403
        </Title>

        <Text fw={500}>
          Access Forbidden
        </Text>

        <Text size="sm" c="dimmed" ta="center">
          You don't have necessary permission <br />
          to view this resource.
        </Text>

        <Group mt="md">
          <Button variant="outline" onClick={() => history.go(-1)}>
            Go Back
          </Button>

          <Button onClick={() => navigate({ to: '/' })}>
            Back to Home
          </Button>
        </Group>

      </Stack>
    </Center>
  )
}