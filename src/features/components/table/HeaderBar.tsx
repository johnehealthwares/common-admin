import { ActionIcon, Button, Group, Text, TextInput } from '@mantine/core';
import { Download, Filter, RefreshCcw, Search, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Column, FilterValue } from '@/features/rxsoft/types';
import { useDebouncedValue } from '../utils';
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
  onDelete,
  hasFilterableColumns,
  minSearchLength = 2,
  debounceMs = 300,
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
  onDelete?: () => void;
  hasFilterableColumns?: boolean;
  minSearchLength?: number;
  debounceMs?: number;
}) => {
  const [searchValue, setSearchValue] = useState(search);
  const debouncedSearch = useDebouncedValue(searchValue, debounceMs);

  useEffect(() => {
    if (debouncedSearch.length === 0 || debouncedSearch.length >= minSearchLength) {
      onSearchChange(debouncedSearch);
    }
  }, [debouncedSearch, minSearchLength, onSearchChange]);

  useEffect(() => {
    setSearchValue(search);
  }, [search]);

  return (
    <>
      <Group justify="space-between">
        <Group gap="xs">
          <TextInput
            leftSection={<Search size={14} />}
            placeholder="Search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.currentTarget.value)}
          />
          {hasFilterableColumns && (
            <Button variant="subtle" leftSection={<Filter size={14} />} onClick={() => setOpen(true)}>
              Filters
            </Button>
          )}
          {onCreate && (
            <Button variant="subtle" onClick={onCreate}>
              New
            </Button>
          )}
          {onExport && (
            <Button variant="subtle" leftSection={<Download size={14} />} onClick={onExport}>
              Export
            </Button>
          )}
          {onDelete && (
            <Button variant="subtle" leftSection={<Trash size={14} />} onClick={onDelete}>
              Delete
            </Button>
          )}
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
