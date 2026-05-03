import { SearchIcon } from 'lucide-react'
import { Button, Kbd, Group, Text } from '@mantine/core'
import { useSearch } from '@/context/search-provider'

type SearchProps = {
  placeholder?: string
  className?: string
}

export function Search({
  placeholder = 'Search',
}: SearchProps) {
  const { setOpen } = useSearch()

  return (
    <Button
      variant="default"
      onClick={() => setOpen()}
      leftSection={<SearchIcon size={16} />}
      rightSection={
        <Group gap={4} visibleFrom="sm">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </Group>
      }
      styles={{
        root: {
          justifyContent: 'space-between',
          fontWeight: 400,
        },
      }}
    >
      <Text c="dimmed" size="sm">
        {placeholder}
      </Text>
    </Button>
  )
}