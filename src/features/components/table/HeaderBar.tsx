import { ActionIcon, Button, Group, Text } from "@mantine/core"
import FiltersModal from "./filters-modal"
import { Column, FilterValue } from "@/features/rxsoft/types"
import { Search } from "@/components/search"
import { Download, Filter, RefreshCcw, Trash } from "lucide-react"


export const HeaderBar = ({ open,  setOpen, columns, appliedFilters, updateFilters, pageIndex, pageSize, totalItems,onCreate }: {
    open: boolean,
    appliedFilters: Record<string, FilterValue | null>,
    updateFilters: (columnKey: string, filterValue: FilterValue | null) => void
    setOpen: (value: boolean) => void
    columns: Column[]
    pageIndex: number
    pageSize: number
    totalItems: number
    onCreate: () => void
}) => {


    return (
        <>
            <Group justify="space-between">

                <Group gap="xs">
                    <Group gap="sm">
                        <Search placeholder="Open command menu" />
                    </Group>
                    <Button variant="subtle" leftSection={<Filter size={14} />} onClick={() => setOpen(true)}>
                        Filters
                    </Button>
                    <Button variant="subtle" onClick={onCreate}>New</Button>
                    <Button variant="subtle" leftSection={<Download size={14} />}>
                        Export
                    </Button>
                    <Button variant="subtle" leftSection={<Trash size={14} />}>
                        Delete
                    </Button>
                    <Group gap="sm">
                        <Search placeholder="Open command menu" />
                    </Group>
                </Group>

                <Group gap="xs">
                    <Text size="xs" c="dimmed">
                        {Math.ceil(totalItems / pageSize)}–{pageIndex * pageSize} of {totalItems}
                    </Text>
                    <ActionIcon variant="subtle">
                        <RefreshCcw size={16} />
                    </ActionIcon>
                </Group>
            </Group>
            <FiltersModal open={open} setOpen={setOpen} columns={columns} appliedFilters={appliedFilters} updateFilters={updateFilters} />
        </>
    )
}