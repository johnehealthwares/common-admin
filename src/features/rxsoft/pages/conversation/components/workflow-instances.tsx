import { useMemo, useState } from 'react'
import { PaginatedDataTable } from '@/features/components/paginated-data-table'
import { RxPage } from '@/features/components/rx-page'
import {
  JsonPreviewDialog,
  normalizeRows,
  useConversationList,
} from './shared'
import { Button } from '@mantine/core'

export function RxWorkflowInstancesPage() {
  const [search, setSearch] = useState('')
  const [selectedRow, setSelectedRow] = useState<Record<string, unknown> | null>(null)

  const instancesQuery = useConversationList('/workflow-instances', search)
  const workflowsQuery = useConversationList('/workflows', '')

  const workflowNameMap = useMemo(() => {
    const map = new Map<string, string>()
    normalizeRows(workflowsQuery.data ?? []).forEach((workflow) => {
      map.set(String(workflow.id), String(workflow.name ?? workflow.code ?? workflow.id))
    })
    return map
  }, [workflowsQuery.data])

  const rows = useMemo(() => {
    return normalizeRows(instancesQuery.data ?? []).map((row) => ({
      ...row,
      workflowName:
        workflowNameMap.get(String(row.workflowId ?? '')) ??
        String(row.workflowId ?? ''),
    }))
  }, [instancesQuery.data, workflowNameMap])

  return (
    <RxPage
      title='Workflow Instances'
      description='Track active and completed workflow runs, inspect current state, and filter by workflow or flow.'
    >
      <PaginatedDataTable
        columns={[
          { key: 'workflowName', label: 'Workflow Name' },
          { key: 'workflowVersion', label: 'Version' },
          { key: 'flowId', label: 'Flow Name' },
          { key: 'status', label: 'Status' },
          {
            key: 'currentState',
            label: 'Current State',
            render: (row) => String(row.currentStepId ?? '-'),
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
        isLoading={instancesQuery.isLoading || workflowsQuery.isLoading}
        isError={instancesQuery.isError || workflowsQuery.isError}
        searchValue={search}
        onSearchChange={setSearch}
      />

      <JsonPreviewDialog
        open={selectedRow != null}
        onOpenChange={(open) => {
          if (!open) setSelectedRow(null)
        }}
        title='Workflow Instance'
        value={selectedRow}
      />
    </RxPage>
  )
}
