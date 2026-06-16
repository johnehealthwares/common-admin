import { Box, Group, Loader, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { BarChart3 } from 'lucide-react';
import { useModuleContext } from '@/context/module-context';

export function MetricsBar({ endpoint }: { endpoint: string }) {
  const { apiProvider } = useModuleContext();

  const { data, isLoading } = useQuery({
    queryKey: ['metrics', endpoint],
    queryFn: async () => {
      const res = await apiProvider.get(endpoint);
      return res.data;
    },
  });

  if (isLoading) return <Loader size="xs" />;

  const lastCreated = data?.lastCreated ?? data;

  if (!lastCreated) return null;

  return (
    <Box bg="gray.0" py={4} px="md" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
      <Group gap="xs">
        <BarChart3 size={14} />
        <Text size="xs" c="dimmed">
          Last created: <Text component="span" fw={600}>{lastCreated.code}</Text>
        </Text>
      </Group>
    </Box>
  );
}