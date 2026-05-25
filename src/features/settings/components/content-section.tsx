import { ReactNode } from 'react'
import { Box, Divider, Stack, Text, Title } from '@mantine/core'

type ContentSectionProps = {
  title: string
  desc: string
  children: ReactNode
}

export function ContentSection({
  title,
  desc,
  children,
}: ContentSectionProps) {
  return (
    <Stack h="100%" flex={1} gap={0}>
      <Box>
        <Title order={3} size="lg">
          {title}
        </Title>

        <Text size="sm" c="dimmed">
          {desc}
        </Text>
      </Box>

      <Divider my="md" />

      <Box
        style={{
          height: '100%',
          width: '100%',
          overflowY: 'auto',
          scrollBehavior: 'smooth',
          paddingRight: '1rem',
          paddingBottom: '3rem',
        }}
      >
        <Box
          style={{
            marginInline: '-0.25rem',
            paddingInline: '0.375rem',
            maxWidth: '36rem',
          }}
        >
          {children}
        </Box>
      </Box>
    </Stack>
  )
}