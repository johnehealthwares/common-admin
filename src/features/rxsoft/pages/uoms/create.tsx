import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { notifications } from '@mantine/notifications'
import { Button, Card, TextInput, Stack, Group, Text } from '@mantine/core'

import { RxPage } from '../../../components/rx-page'
import { rxsoftApi } from '@/lib/rxsoft-api'

export function RxUomEditPage({ uomId }: { uomId: string }) {
  const navigate = useNavigate()

  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [status, setStatus] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: async () => {
      await rxsoftApi.patch(`/uoms/${uomId}`, {
        code: code || undefined,
        name: name || undefined,
        categoryId: categoryId || undefined,
      })
    },
    onSuccess: () => {
      setStatus('UOM updated successfully.')
      notifications.show({
        message: 'UOM updated successfully.',
        color: 'green',
      })
      navigate({ to: '/uoms/$uomId', params: { uomId } })
    },
    onError: () => {
      setStatus('Failed to update UOM.')
      notifications.show({
        message: 'Failed to update UOM.',
        color: 'red',
      })
    },
  })

  return (
    <RxPage
      title="Edit UOM"
      description="PATCH /uoms/{uomId}"
      actions={
        <Button component={Link} to="/uoms" variant="outline">
          Back to UOMs
        </Button>
      }
    >
      <Card withBorder radius="md" p="lg">
        <form
          onSubmit={(event) => {
            event.preventDefault()
            mutation.mutate()
          }}
        >
          <Stack gap="md">
            <Group grow>
              <TextInput
                label="Code"
                value={code}
                onChange={(e) => setCode(e.currentTarget.value)}
              />

              <TextInput
                label="Name"
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
              />

              <TextInput
                label="Category ID"
                value={categoryId}
                onChange={(e) => setCategoryId(e.currentTarget.value)}
              />
            </Group>

            <Group justify="flex-start">
              <Button type="submit" loading={mutation.isPending}>
                Save
              </Button>
            </Group>
          </Stack>
        </form>

        {status ? (
          <Text size="sm" c="dimmed" mt="md">
            {status}
          </Text>
        ) : null}
      </Card>
    </RxPage>
  )
}