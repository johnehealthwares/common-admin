import { useEffect, useMemo, useState } from 'react'
import { useQuery, useQueryClient, type QueryKey } from '@tanstack/react-query'
import { Download, Plus } from 'lucide-react'

import { Card, Group, Stack, Text, Button } from '@mantine/core'

import { rxsoftApi } from '@/lib/rxsoft-api'
import { DataPageShellProps, Field, FilterValue } from '../rxsoft/types'
import { Pagination } from './pagination'
import { getArrayPayload } from './utils'
import { RxPage } from './rx-page'
import { MultiSelectField } from './form/multiselect'
import { DebouncedInput } from './debounced-search'
import {
  useCreateMutation,
  useDeleteMutation,
  useExportMutation,
  useUpdateMutation,
} from './mutations'
import { DataTable } from './table/table'
import { HeaderBar } from './table/HeaderBar'
import { ModalDataForm } from './form/ModalDataForm'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { JsonPreviewDialog } from '../rxsoft'

function getRowsFromPayload(payload: unknown): Record<string, unknown>[] {
  return getArrayPayload(payload)
}

function CardHeaderBlock({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <Card p="md" withBorder>
      <Group justify="space-between">
        <Stack gap={2}>
          <Text fw={600}>{title}</Text>
          {description && (
            <Text size="sm" c="dimmed">
              {description}
            </Text>
          )}
        </Stack>
      </Group>
    </Card>
  )
}

export function DataPageShell(props: DataPageShellProps) {
  const {
    title,
    description,
    endpoint,
    columns,
    modalTitle,
    createFields,
    createFieldGroups,
    tabGroups,
    sortOptions,
    searchConfig,
    buildCreatePayload,
    buildUpdatePayload,
    canExport,
    canDelete = false,
    csvEndpoint,
    detailPathBuilder,
    editPathBuilder,
    deletePathBuilder,
    renderCreateExtras,
    onCreateSuccess,
  } = props



  const queryClient = useQueryClient()

  // -----------------------------
  // STATE
  // -----------------------------
  const [search, setSearch] = useState('')
  const [searchBy, setSearchBy] = useState<string[]>([])
  const [showModal, setShowModal] = useState(false)
  const [formState, setFormState] = useState<Record<string, unknown>>(props.formState || {})
  const [editingRow, setEditingRow] = useState<Record<string, unknown> | null>(null)
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalItems, setTotalItems] = useState(0)


  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false)
  const [jsonToPreview, setJsonToPreview] = useState<Record<string, unknown> | null>(null)

  const [filtersModalOpened, setFiltersModalOpened] = useState<boolean>(false);

  const [appliedFilters, setAppliedFilters] = useState<Record<string, FilterValue | null>>({})
  const handleApplyFilter = (columnKey: string, filterValue: FilterValue | null) => {

    setAppliedFilters((prev) => ({
      ...prev,
      [columnKey]: filterValue,
    }))
  }


  const hasCreate = Boolean(createFields || createFieldGroups)
  const hasInlineEdit = hasCreate && !editPathBuilder

  const fieldGroups =
    createFieldGroups ?? (createFields ? [{ fields: createFields }] : [])

  // -----------------------------
  // QUERY PARAMS
  // -----------------------------
  const queryParams = useMemo(() => {
    const params: Record<string, unknown> = {}

    if (searchConfig?.param && searchBy.length > 0) {
      const searchObj: Record<string, string> = {}
      searchBy.forEach((key) => {
        searchObj[key] = search
      })
      params[searchConfig.param] = JSON.stringify(searchObj)
    }

    // -----------------------------
    // FILTERS ✅ NEW
    // -----------------------------
    if (appliedFilters) {
      Object.entries(appliedFilters).filter(([a, b]) => a && b).forEach(([columnKey, filterValue]) => {
        params[columnKey] = `${filterValue?.filter.type}|${filterValue?.value}|${filterValue?.valueTo}`
      })
    }

    params.page = pageIndex
    params.limit = pageSize

    return params
  }, [search, searchBy, searchConfig?.param, appliedFilters, pageIndex, pageSize])

  useEffect(() => {
    setPageIndex(1)
  }, [search])

  // -----------------------------
  // DATA FETCH
  // -----------------------------
  const query = useQuery({
    queryKey: ['rxsoft-data-page', endpoint, queryParams] satisfies QueryKey,
    queryFn: async () => {
      const response = await rxsoftApi.get(endpoint, { params: queryParams })
      const meta = response.data?.meta

      setPageIndex(meta?.page ?? 1)
      setTotalItems(meta?.total ?? 0)

      return response.data
    },
  })



  const rows = getRowsFromPayload(query.data)

  // -----------------------------
  // MUTATIONS
  // -----------------------------
  const createMutation = useCreateMutation({
    buildCreatePayload,
    onCreateSuccess,
    endpoint,
    formState,
    queryClient,
    setShowModal,
    setFormState,
    title,
  })


  const updateMutation = useUpdateMutation(
    {
      buildUpdatePayload,
      endpoint,
      formState,
      queryClient,
      setShowModal,
      setFormState,
      title,
      setEditingRow,
      editingRow,
    }
  )

  const deleteMutation = useDeleteMutation({
    endpoint,
    formState,
    queryClient,
    title,
    deletePathBuilder,
  })

  const exportMutation = useExportMutation({
    endpoint,
    formState,
    queryClient,
    title,
    csvEndpoint,
  })

  // -----------------------------
  // HELPERS
  // -----------------------------
  function updateField(name: string, value: unknown) {
    setFormState((prev) => ({ ...prev, [name]: value }))
    console.log({name, value})
  }

  function openModal(row: Record<string, unknown> | null = null) {
    setEditingRow(row)
    setFormState(row || {})
    setShowModal(true)
  }

  function handleDelete() {

  }
  return (
    <RxPage
      title={title}
      description={description}
      actions={
        <>
          {searchConfig && (
            <>
              <MultiSelectField
                value={searchBy}
                options={searchConfig.filters}
                onChange={setSearchBy}
                placeholder="Filters"
              />
              <DebouncedInput onChange={setSearch} />
            </>
          )}

          {canExport && (
            <button onClick={() => exportMutation.mutate()}>
              <Download />
            </button>
          )}


          <Button onClick={() => { setEditingRow(null); setShowModal(true) }}>
            <Plus /> Add
          </Button>

        </>
      }
    >

      {/* // -----------------------------
      // PAGE CONTENT
      // ----------------------------- */}
        {/* HEADER BAR */}
        <HeaderBar
          open={filtersModalOpened}
          setOpen={setFiltersModalOpened}
          appliedFilters={appliedFilters}
          updateFilters={handleApplyFilter}
          columns={columns}
          pageIndex={pageIndex}
          pageSize={pageSize}
          totalItems={totalItems}
          onCreate={() => { setShowModal(true) }}
        />

        <DataTable
          columns={columns}
          rows={rows}
          isLoading={query.isLoading}
          errorLoading={query.isError}
          actionCellProps={{
            canDelete,
            detailPathBuilder,
            editPathBuilder,
            hasInlineEdit,
            openEditModal: openModal,
            deleteMutation,
          }}
          appliedFilters={appliedFilters}
          applyColumnFilter={handleApplyFilter}
        />
        <Pagination
          pageIndex={pageIndex}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={setPageIndex}
          onPageSizeChange={setPageSize}
        />
        <ModalDataForm
          editingRow={editingRow}
          showModal={showModal}
          setShowModal={setShowModal}
          title={title}
          tabGroups={tabGroups}
          fieldGroups={fieldGroups}
          mutation={editingRow ? updateMutation : createMutation}
          modalTitle={modalTitle}
          formState={formState}
          setFormState={setFormState}
          renderCreateExtras={renderCreateExtras}
          updateField={updateField}
        />

        {/* DELETE CONFIRMATION DIALOG */}
        <ConfirmDialog
          title={`Delete ${title}`}
          description={`Are you sure you want to delete this ${title}? This action cannot be undone.`}
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          onConfirm={handleDelete}
          confirmText="Delete"
          isLoading={deleteMutation.isPending}
        />

        {/* JSON PREVIEW DIALOG */}
        <JsonPreviewDialog
          value={jsonToPreview}
          title={`${title}: ${jsonToPreview?.name}`}
          open={jsonToPreview !== null}
          onOpenChange={(open) => setJsonToPreview(!open ? null : jsonToPreview)}
        />

    </RxPage>
  )
}