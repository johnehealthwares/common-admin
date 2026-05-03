import React, { useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Moon, Sun } from 'lucide-react'
import { ActionIcon, Modal, Stack, TextInput, Box, Text, Group, ScrollArea } from '@mantine/core'
import { useSearch } from '@/context/search-provider'
import { useTheme } from '@/context/theme-provider'
import { useModuleStore } from '@/stores/module-store'
import { filterNavGroupsByModule, sidebarData } from '@/layout/data/sidebar-data'

export function CommandMenu() {
  const navigate = useNavigate()
  const { setTheme, theme } = useTheme()
  const { open, setOpen } = useSearch()
  const [search, setSearch] = React.useState('')
  const selectedModule = useModuleStore((state) => state.selectedModule)
  const filteredNavGroups = filterNavGroupsByModule(sidebarData.navGroups, selectedModule)

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false)
      setSearch('')
      command()
    },
    [setOpen]
  )

  const searchedItems = useMemo(() => {
    if (!search.trim()) {
      return filteredNavGroups
    }

    const searchLower = search.toLowerCase()
    return filteredNavGroups
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (item) =>
            item.title.toLowerCase().includes(searchLower) ||
            item.url?.toLowerCase().includes(searchLower)
        ),
      }))
      .filter((group) => group.items.length > 0)
  }, [search, filteredNavGroups])

  return (
    <Modal
      opened={open}
      onClose={() => {
        setOpen(false)
        setSearch('')
      }}
      title="Command Menu"
      size="md"
    >
      <Stack gap="md">
        <TextInput
          placeholder="Type a command or search..."
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          autoFocus
        />
        
        <ScrollArea style={{ height: 300 }}>
          {searchedItems.length === 0 ? (
            <Text size="sm" c="dimmed" ta="center" py="md">
              No results found.
            </Text>
          ) : (
            <Stack gap="xs">
              {searchedItems.map((group) => (
                <Box key={group.title}>
                  <Text size="xs" fw={600} c="dimmed" mb="xs">
                    {group.title}
                  </Text>
                  <Stack gap="xs">
                    {group.items.map((navItem, i) => {
                      if (navItem.url) {
                        return (
                          <Box
                            key={`${navItem.url}-${i}`}
                            onClick={() => {
                              runCommand(() => navigate({ to: navItem.url }))
                            }}
                            p="xs"
                            style={{
                              cursor: 'pointer',
                              borderRadius: '0.375rem',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'var(--mantine-color-gray-1)'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent'
                            }}
                          >
                            <Group justify="space-between">
                              <Text size="sm">{navItem.title}</Text>
                            </Group>
                          </Box>
                        )
                      }

                      return navItem.items?.map((subItem, i) => (
                        <Box
                          key={`${navItem.title}-${subItem.url}-${i}`}
                          onClick={() => {
                            runCommand(() => navigate({ to: subItem.url }))
                          }}
                          p="xs"
                          style={{
                            cursor: 'pointer',
                            borderRadius: '0.375rem',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--mantine-color-gray-1)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent'
                          }}
                        >
                          <Text size="sm">{navItem.title} / {subItem.title}</Text>
                        </Box>
                      ))
                    })}
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </ScrollArea>

        <Group justify="space-between">
          <Text size="xs" c="dimmed">
            Press ESC to close
          </Text>
          <Group gap="xs">
            <ActionIcon
              variant="subtle"
              size="lg"
              onClick={() => {
                const newTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'
                setTheme(newTheme)
              }}
            >
              {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
            </ActionIcon>
          </Group>
        </Group>
      </Stack>
    </Modal>
  )
}
