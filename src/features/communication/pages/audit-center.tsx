import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { switchApi } from '@/lib/switch-api'
import { RxPage } from '@/features/components/rx-page'
import { Button, Input } from '@mantine/core'

export function AuditCenterPage() {
  const [selectedId, setSelectedId] = useState('')
  const [searchId, setSearchId] = useState('')

  const {
    data: traces,
    isLoading: isListing,
    isError: hasListError,
    refetch: refetchTraces,
  } = useQuery({
    queryKey: ['communication', 'flow', 'traces'],
    queryFn: async () => {
      const response = await switchApi.get('/flow/traces?limit=50')
      return response.data
    },
    retry: false,
  })

  const {
    data: audit,
    isLoading: isLoadingAudit,
    isError: hasAuditError,
  } = useQuery({
    queryKey: ['communication', 'flow', 'audit', selectedId],
    queryFn: async () => {
      if (!selectedId) return null
      const response = await switchApi.get(`/flow/audit/${encodeURIComponent(selectedId)}`)
      return response.data
    },
    enabled: Boolean(selectedId),
    retry: false,
  })

  return (
    <RxPage
      title="Audit Center"
      description="Browse recent switch traces and inspect audit details for message delivery."
      actions={
        <Button onClick={() => refetchTraces()}>
          Refresh Traces
        </Button>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4 rounded-lg border bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-[1fr_auto]">
            <Input
              value={searchId}
              onChange={(event) => setSearchId(event.target.value)}
              placeholder="Search trace by message ID"
            />
            <Button
              onClick={() => setSelectedId(searchId.trim())}
              disabled={!searchId.trim()}
            >
              Load Audit
            </Button>
          </div>

          {isListing ? (
            <p className="text-sm text-muted-foreground">Loading recent traces…</p>
          ) : null}
          {hasListError ? (
            <p className="text-sm text-red-600">Unable to load recent traces.</p>
          ) : null}

          {Array.isArray(traces) && traces.length > 0 ? (
            <div className="space-y-3">
              {traces.map((trace: any) => (
                <button
                  key={trace.messageId}
                  onClick={() => setSelectedId(trace.messageId)}
                  className="w-full rounded-lg border border-slate-200 p-4 text-left transition hover:border-primary"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium">{trace.messageId}</p>
                      <p className="text-xs text-slate-500">Status: {trace.status}</p>
                    </div>
                    <div className="text-xs text-slate-500">Events: {trace.events?.length ?? 0}</div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No recent traces available yet.</p>
          )}
        </div>

        <div className="space-y-4 rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Audit Details</h2>
              <p className="text-sm text-slate-500">Selected message ID: {selectedId || 'None'}</p>
            </div>
            {selectedId ? (
              <Button onClick={() => setSelectedId('')}>Clear</Button>
            ) : null}
          </div>

          {isLoadingAudit ? (
            <p className="text-sm text-muted-foreground">Loading audit…</p>
          ) : null}
          {hasAuditError ? (
            <p className="text-sm text-red-600">Unable to load audit for this message.</p>
          ) : null}

          {audit ? (
            <div className="space-y-4">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold">Audit Summary</p>
                <pre className="mt-2 whitespace-pre-wrap text-xs">{JSON.stringify(audit, null, 2)}</pre>
              </div>
            </div>
          ) : (
            selectedId ? (
              <p className="text-sm text-muted-foreground">No audit data found for this message ID.</p>
            ) : (
              <p className="text-sm text-muted-foreground">Select a trace to view the audit details.</p>
            )
          )}
        </div>
      </div>
    </RxPage>
  )
}
