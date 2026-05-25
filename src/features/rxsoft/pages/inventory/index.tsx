import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import {
  Card,
  Text,
  Stack,
  Grid,
  Button,
  TextInput,
  Loader,
  Group,
} from '@mantine/core'

import { notifications } from '@mantine/notifications'
import { rxsoftApi } from '@/lib/rxsoft-api'
import { RxPage } from '../../../components/page/rx-page'
import { DataPageShell } from '../../../components/page/data-page-shell'

export function RxInventoryPage() {
  const [stockBalanceId, setStockBalanceId] = useState('')
  const [deltaQuantity, setDeltaQuantity] = useState('')
  const [reason, setReason] = useState('')
  const [formState1, setFormState1] = useState<Record<string, unknown>>({})
  const [formState2, setFormState2] = useState<Record<string, unknown>>({})

  const updateField1 = (code: string, value: unknown) => {
  }

  const updateField2 = (code: string, value: unknown) => {

  }

  const adjustmentMutation = useMutation({
    mutationFn: async () => {
      await rxsoftApi.post('/inventory/adjustments', {
        stockBalanceId,
        deltaQuantity: Number(deltaQuantity),
        reason,
      })
    },
    onSuccess: () => {
      notifications.show({
        message: 'Adjustment posted successfully.',
        color: 'green',
      })

      setStockBalanceId('')
      setDeltaQuantity('')
      setReason('')
    },
    onError: () => {
      notifications.show({
        message: 'Failed to post adjustment.',
        color: 'red',
      })
    },
  })

  return (
    <RxPage
      title="Inventory"
      description="Stock balances, movement history, and manual adjustments."
    >
      <Stack gap="xl">
        {/* STOCK BALANCES */}
        <DataPageShell
          title="Stock Balances"
          description="Inventory stock balances with pagination and filters."
          endpoint="/inventory/stock-balances"
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'productId', label: 'Product' },
            { key: 'locationId', label: 'Location' },
            { key: 'quantityOnHand', label: 'On Hand' },
          ]}
          formState={formState1}
          setFormState={setFormState1}
          updateField={updateField1}
      />

        {/* STOCK MOVEMENTS */}
        <DataPageShell
          title="Stock Movements"
          description="Inventory movement log."
          endpoint="/inventory/stock-movements"
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'stockBalanceId', label: 'Stock Balance' },
            { key: 'movementType', label: 'Type' },
            { key: 'quantity', label: 'Quantity' },
            { key: 'createdAt', label: 'Created' },
          ]}
          formState={formState2}
          setFormState={setFormState2}
          updateField={updateField2}
        />

        {/* ADJUSTMENT FORM */}
        <Card withBorder p="md">
          <Stack gap="sm">
            <Text fw={600}>New Stock Adjustment</Text>
            <Text size="sm" c="dimmed">
              POST /inventory/adjustments
            </Text>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                adjustmentMutation.mutate()
              }}
            >
              <Grid>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <TextInput
                    label="Stock Balance ID"
                    value={stockBalanceId}
                    onChange={(e) => setStockBalanceId(e.currentTarget.value)}
                    required
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 4 }}>
                  <TextInput
                    label="Delta Quantity"
                    type="number"
                    value={deltaQuantity}
                    onChange={(e) => setDeltaQuantity(e.currentTarget.value)}
                    required
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 4 }}>
                  <TextInput
                    label="Reason"
                    value={reason}
                    onChange={(e) => setReason(e.currentTarget.value)}
                    required
                  />
                </Grid.Col>

                <Grid.Col span={12}>
                  <Group justify="flex-end">
                    <Button
                      type="submit"
                      loading={adjustmentMutation.isPending}
                    >
                      Post Adjustment
                    </Button>
                  </Group>
                </Grid.Col>
              </Grid>
            </form>
          </Stack>
        </Card>
      </Stack>
    </RxPage>
  )
}