import { Popover, Skeleton, Stack, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { rxsoftApi } from '@/lib/rxsoft-api';

type ResourcePopoverProps = {
  resourceId: string | null;
  endpoint: string;
  children?: React.ReactNode;
  render: (data: unknown) => React.ReactNode;
  fallback?: React.ReactNode;
};

const HOVER_DELAY = 300;

function shortenId(id: string) {
  if (id.length <= 8) {return id;}
  return `${id.slice(0, 4)}…${id.slice(-4)}`;
}

export function ResourcePopover({ resourceId, endpoint, children, render, fallback }: ResourcePopoverProps) {
  const [opened, setOpened] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data, isFetching } = useQuery({
    queryKey: [endpoint, resourceId],
    queryFn: async () => {
      const { data } = await rxsoftApi.get(`${endpoint}/${resourceId}`);
      return data;
    },
    enabled: opened && !!resourceId,
  });

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleOpen = () => {
    clearTimer();
    timerRef.current = setTimeout(() => {
      if (resourceId) {setOpened(true);}
    }, HOVER_DELAY);
  };

  const handleClose = () => {
    clearTimer();
    timerRef.current = setTimeout(() => {
      setOpened(false);
    }, HOVER_DELAY);
  };

  if (!resourceId) {return <>{fallback ?? '-'}</>;}

  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      position="top"
      withArrow
      shadow="md"
      withinPortal
    >
      <Popover.Target>
        <span
          onMouseEnter={handleOpen}
          onMouseLeave={handleClose}
          style={{ cursor: 'pointer', borderBottom: '1px dashed var(--mantine-color-gray-5)' }}
        >
          {children ?? shortenId(resourceId)}
        </span>
      </Popover.Target>
      <Popover.Dropdown onMouseEnter={clearTimer} onMouseLeave={handleClose}>
        {isFetching ? (
          <Stack gap="xs" miw={180}>
            <Skeleton height={14} width="60%" />
            <Skeleton height={14} width="40%" />
          </Stack>
        ) : data ? (
          render(data)
        ) : (
          <Text size="sm" c="dimmed">No data</Text>
        )}
      </Popover.Dropdown>
    </Popover>
  );
}
