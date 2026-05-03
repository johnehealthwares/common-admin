import { useMemo, useState } from 'react'
import { PaginatedDataTable } from '@/features/components/paginated-data-table'
import { RxPage } from '@/features/components/rx-page'
import {
  JsonPreviewDialog,
  normalizeRows,
  useConversationList,
} from './shared'
import { Button } from '@mantine/core'

export function RxWorkflowEventsPage() {
  const [search, setSearch] = useState('')
  const [selectedPayload, setSelectedPayload] = useState<unknown>(null)

  const eventsQuery = useConversationList('/workflow-events', search)
  const instancesQuery = useConversationList('/workflow-instances', '')
  const workflowsQuery = useConversationList('/workflows', '')

  const workflowNameMap = useMemo(() => {
    const instanceMap = new Map<string, string>()
    normalizeRows(instancesQuery.data ?? []).forEach((instance) => {
      instanceMap.set(String(instance.id), String(instance.workflowId ?? ''))
    })

    const workflowMap = new Map<string, string>()
    normalizeRows(workflowsQuery.data ?? []).forEach((workflow) => {
      workflowMap.set(String(workflow.id), String(workflow.name ?? workflow.code ?? workflow.id))
    })

    return {
      resolve(instanceId: string) {
        const workflowId = instanceMap.get(instanceId)
        if (!workflowId) return instanceId
        return workflowMap.get(workflowId) ?? workflowId
      },
    }
  }, [instancesQuery.data, workflowsQuery.data])

  const rows = useMemo(() => {
    return normalizeRows(eventsQuery.data ?? []).map((row) => ({
      ...row,
      workflowName: workflowNameMap.resolve(String(row.workflowInstanceId ?? '')),
    }))
  }, [eventsQuery.data, workflowNameMap])

  return (
    <RxPage
      title='Workflow Events'
      description='Monitor workflow events and inspect full payloads when debugging transitions or event processing.'
    >
      <PaginatedDataTable
        columns={[
          { key: 'workflowName', label: 'Workflow Name' },
          { key: 'type', label: 'Type' },
          { key: 'correlationId', label: 'Correlation' },
          { key: 'sequence', label: 'Sequence' },
          {
            key: 'payload',
            label: 'Payload',
            render: (row) => (
              <span className='font-mono text-xs'>
                {JSON.stringify(row.payload ?? {}, null, 0).slice(0, 80)}
              </span>
            ),
          },
          {
            key: 'actions',
            label: 'Action',
            render: (row) => (
              <Button type='button' variant='outline' size='sm' onClick={() => setSelectedPayload(row)}>
                View
              </Button>
            ),
          },
        ]}
        rows={rows}
        isLoading={eventsQuery.isLoading || instancesQuery.isLoading || workflowsQuery.isLoading}
        isError={eventsQuery.isError || instancesQuery.isError || workflowsQuery.isError}
        searchValue={search}
        onSearchChange={setSearch}
      />

      <JsonPreviewDialog
        open={selectedPayload != null}
        onOpenChange={(open) => {
          if (!open) setSelectedPayload(null)
        }}
        title='Workflow Event'
        value={selectedPayload}
      />
    </RxPage>
  )
}
