import { ActionIcon, Button, Group, Text, TextInput } from '@mantine/core';
import { Download, Filter, RefreshCcw, Search, Trash } from 'lucide-react';
import { Column, FilterValue } from '@/features/rxsoft/types';
import FiltersModal from './filters-modal';

export const HeaderBar = ({
  open,
  setOpen,
  columns,
  appliedFilters,
  updateFilters,
  pageIndex,
  pageSize,
  totalItems,
  onCreate,
  refresh,
  search,
  onSearchChange,
  customActions,
  onExport,
}: {
  open: boolean;
  appliedFilters: Record<string, FilterValue | null>;
  updateFilters: (columnKey: string, filterValue: FilterValue | null) => void;
  setOpen: (value: boolean) => void;
  columns: Column[];
  pageIndex: number;
  pageSize: number;
  totalItems: number;
  onCreate?: () => void;
  refresh: () => void;
  search: string;
  onSearchChange: (value: string) => void;
  customActions?: React.ReactNode;
  onExport?: () => void;
}) => {
  return (
    <>
      <Group justify="space-between">
        <Group gap="xs">
          <TextInput
            leftSection={<Search size={14} />}
            placeholder="Search"
            value={search}
            onChange={(event) => onSearchChange(event.currentTarget.value)}
          />
          <Button variant="subtle" leftSection={<Filter size={14} />} onClick={() => setOpen(true)}>
            Filters
          </Button>
          {onCreate && (
            <Button variant="subtle" onClick={onCreate}>
              New
            </Button>
          )}
          <Button variant="subtle" leftSection={<Download size={14} />} onClick={onExport}>
            Export
          </Button>
          <Button variant="subtle" leftSection={<Trash size={14} />}>
            Delete
          </Button>
          {customActions}
        </Group>

        <Group gap="xs">
          <Text size="xs" c="dimmed">
            {Math.ceil(totalItems / pageSize)}–{pageIndex * pageSize} of {totalItems}
          </Text>
          <ActionIcon variant="subtle" onClick={refresh}>
            <RefreshCcw size={16} />
          </ActionIcon>
        </Group>
      </Group>
      <FiltersModal
        open={open}
        setOpen={setOpen}
        columns={columns}
        appliedFilters={appliedFilters}
        updateFilters={updateFilters}
      />
    </>
  );
};
