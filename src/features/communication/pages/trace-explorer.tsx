import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { RxPage } from '@/features/components/rx-page'
import { switchApi } from '@/lib/switch-api'
import { Button, Input } from '@mantine/core'

export function TraceExplorerPage() {
  const [messageId, setMessageId] = useState('')
  const [searchId, setSearchId] = useState('')

  const { data, isLoading } = useQuery<any>({
    queryKey: ['communication', 'trace', searchId],
    queryFn: async () => {
      if (!searchId) return null
      const response = await switchApi.get(`/flow/audit/${encodeURIComponent(searchId)}`)
      return response.data
    },
    enabled: Boolean(searchId),
    retry: false,
  })

  return (
    <RxPage title="Trace Explorer" description="Inspect the lifecycle of a message through the switch.">
      <div className="space-y-6 rounded-lg border bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <Input
            value={messageId}
            onChange={(event) => setMessageId(event.target.value)}
            placeholder="Enter trace message ID"
          />
          <Button
            onClick={() => setSearchId(messageId.trim())}
            disabled={!messageId.trim()}
          >
            Load Trace
          </Button>
        </div>

        {isLoading ? <p className="text-sm text-muted-foreground">Loading trace…</p> : null}

        {data ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold">Message ID</p>
              <p>{data.messageId}</p>
            </div>
            <div className="grid gap-4">
              {Array.isArray(data.events) && data.events.length > 0 ? (
                data.events.map((event: any, index: number) => (
                  <div key={index} className="rounded-lg border border-slate-200 p-4">
                    <p className="font-medium">{event.eventType}</p>
                    <p className="text-xs text-slate-500">{new Date(event.timestamp).toLocaleString()}</p>
                    <pre className="mt-2 whitespace-pre-wrap text-xs text-slate-700">{JSON.stringify(event.snapshot, null, 2)}</pre>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No trace events found for this ID.</p>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </RxPage>
  )
}
