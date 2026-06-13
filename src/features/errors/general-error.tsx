import { Button, Stack, Text, Title, Center, Group } from '@mantine/core';
import { useNavigate, useRouter } from '@tanstack/react-router';

type GeneralErrorProps = React.HTMLAttributes<HTMLDivElement> & {
  minimal?: boolean;
};

export function GeneralError({ minimal = false, ...props }: GeneralErrorProps) {
  const navigate = useNavigate();
  const { history } = useRouter();

  console.log({ props });
  return (
    <Center style={{ height: '100vh', width: '100%' }}>
      <Stack align="center" gap="xs">
        {!minimal && (
          <Title order={1} size="6rem">
            500
          </Title>
        )}

        <Text fw={500}>Oops! Something went wrong :'</Text>

        <Text size="sm" c="dimmed" ta="center">
          We apologize for the inconvenience. <br />
          Please try again later.
        </Text>
        <Text size="sm" c="dimmed" ta="center">
          {(props as any).error?.message}
        </Text>

        <Text size="sm" c="dimmed" ta="center">
          {(props as any).error?.stack}
        </Text>

        {!minimal && (
          <Group mt="md">
            <Button variant="outline" onClick={() => history.go(-1)}>
              Go Back
            </Button>

            <Button onClick={() => navigate({ to: '/' })}>Back to Home</Button>
          </Group>
        )}
      </Stack>
    </Center>
  );
}
