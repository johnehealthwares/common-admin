import { useMemo, useState } from 'react'
import { PaginatedDataTable } from '@/features/components/paginated-data-table'
import { RxPage } from '@/features/components/rx-page'
import {
  JsonPreviewDialog,
  normalizeRows,
  useConversationList,
} from './shared'
import { Button } from '@mantine/core'

export function RxExchangesPage() {
  const [search, setSearch] = useState('')
  const [selectedRow, setSelectedRow] = useState<Record<string, unknown> | null>(null)

  const exchangesQuery = useConversationList('/exchanges', search)

  const rows = useMemo(
    () => normalizeRows(exchangesQuery.data ?? []),
    [exchangesQuery.data],
  )

  return (
    <RxPage
      title='Exchanges'
      description='Review inbound and outbound channel exchanges, message lifecycle, and related payload metadata.'
    >
      <PaginatedDataTable
        columns={[
          { key: 'channelType', label: 'Channel' },
          { key: 'direction', label: 'Direction' },
          { key: 'status', label: 'Status' },
          {
            key: 'party',
            label: 'Party',
            render: (row) => String(row.sender ?? row.recipient ?? '-'),
          },
          { key: 'messageId', label: 'Message ID' },
          {
            key: 'message',
            label: 'Message',
            render: (row) => (
              <span className='max-w-[320px] whitespace-normal text-sm'>
                {String(row.message ?? '')}
              </span>
            ),
          },
          {
            key: 'actions',
            label: 'Action',
            render: (row) => (
              <Button type='button' variant='outline' size='sm' onClick={() => setSelectedRow(row)}>
                View
              </Button>
            ),
          },
        ]}
        rows={rows}
        isLoading={exchangesQuery.isLoading}
        isError={exchangesQuery.isError}
        searchValue={search}
        onSearchChange={setSearch}
      />

      <JsonPreviewDialog
        open={selectedRow != null}
        onOpenChange={(open) => {
          if (!open) setSelectedRow(null)
        }}
        title='Exchange Detail'
        value={selectedRow}
      />
    </RxPage>
  )
}
