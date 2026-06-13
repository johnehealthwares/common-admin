import { Group, Stack, Text, Title } from '@mantine/core';
import { ReactNode } from 'react';

export function RxPage({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Stack gap="lg">
      {/* PAGE HEADER */}
      <Group justify="space-between" align="flex-end">
        <Stack gap={4}>
          <Title order={2}>{title}</Title>

          {description && (
            <Text size="sm" c="dimmed" maw={700}>
              {description}
            </Text>
          )}
        </Stack>

        {actions && (
          <Group gap="xs" wrap="wrap">
            {actions}
          </Group>
        )}
      </Group>

      {/* CONTENT */}
      <div>{children}</div>
    </Stack>
  );
}
