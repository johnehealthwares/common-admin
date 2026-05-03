import { useState } from 'react'
import { useLocation, useNavigate, Link } from '@tanstack/react-router'
import {
  Select,
  Group,
  Text,
  ScrollArea,
  Stack,
  UnstyledButton,
  Box,
} from '@mantine/core'

type SidebarNavProps = React.HTMLAttributes<HTMLElement> & {
  items: {
    href: string
    title: string
    icon: React.ReactNode
  }[]
}

export function SidebarNav({ items, ...props }: SidebarNavProps) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [val, setVal] = useState(pathname ?? '/settings')

  const handleSelect = (value: string | null) => {
    if (!value) return
    setVal(value)
    navigate({ to: value })
  }

  return (
    <>
      {/* Mobile (Select dropdown) */}
      <Box p="xs" hiddenFrom="md">
        <Select
          value={val}
          onChange={handleSelect}
          data={items.map((item) => ({
            value: item.href,
            label: item.title,
          }))}
          renderOption={({ option }) => {
            const item = items.find((i) => i.href === option.value)
            return (
              <Group gap="sm">
                <span>{item?.icon}</span>
                <Text>{option.label}</Text>
              </Group>
            )
          }}
        />
      </Box>

      {/* Desktop (Sidebar nav) */}
      <ScrollArea
        type="always"
        scrollbars="x"
        visibleFrom="md"
      >
        <Stack gap="xs" p="xs" {...props}>
          {items.map((item) => {
            const active = pathname === item.href

            return (
              <UnstyledButton
                key={item.href}
                component={Link}
                to={item.href}
                style={{
                  padding: '8px 10px',
                  borderRadius: 6,
                  background: active ? 'var(--mantine-color-gray-2)' : undefined,
                }}
              >
                <Group gap="sm">
                  {item.icon}
                  <Text size="sm" fw={500}>
                    {item.title}
                  </Text>
                </Group>
              </UnstyledButton>
            )
          })}
        </Stack>
      </ScrollArea>
    </>
  )
}