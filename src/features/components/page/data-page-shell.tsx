import { useQuery, useQueryClient, type QueryKey } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { ModuleContext, useModuleContext } from '@/context/module-context';
import type { ModelConfig } from '@/features/shared/model-schema';
import { JsonPreviewDialog } from '../../rxsoft';
import type { FilterValue } from '../../rxsoft/types';
import { useFormContext } from '../form/form-context';
import { ModalDataForm } from '../form/ModalDataForm';
import {
  useCreateMutation,
  useDeleteMutation,
  useExportMutation,
  useUpdateMutation,
} from '../form/mutations';
import { HeaderBar } from '../table/HeaderBar';
import { Pagination } from '../table/pagination';
import { DataTable } from '../table/table';
import { getArrayPayload } from '../utils';
import { RxPage } from './rx-page';

function getRowsFromPayload(payload: unknown): Record<string, unknown>[] {
  return getArrayPayload(payload);
}

type DataPageShellProps = {
  config: ModelConfig;
  formState?: Record<string, unknown>;
  setFormState?: (state: Record<string, unknown>) => void;
  updateField?: (name: string, value: unknown) => void;
  embedded?: boolean;
};

export function DataPageShell(props: DataPageShellProps) {
  const {
    config,
    formState: propsFormState,
    setFormState: propsSetFormState,
    updateField: propsUpdateField,
    embedded = false,
  } = props;

  const navigate = useNavigate();

  const {
    title,
    description,
    endpoint,
    columns,
    modalTitle,
    createFields,
    createFieldGroups,
    tabGroups,
    buildCreatePayload,
    buildUpdatePayload,
    buildFormState,
    csvEndpoint,
    createPathBuilder,
    detailPathBuilder,
    editPathBuilder,
    deletePathBuilder,
    renderCreateExtras,
    renderHeaderActions,
    transformRows,
    canDelete,
    canExport,
    defaultState,
    apiProvider: configApiProvider,
  } = config;
  const moduleContext = useModuleContext();
  const apiProvider = configApiProvider ?? moduleContext.apiProvider;
  const moduleId = moduleContext.moduleId;
  const shellModuleContext = configApiProvider
    ? { ...moduleContext, apiProvider: configApiProvider }
    : moduleContext;

  // Try to use FormProvider if available, otherwise use props or local state
  let formContext: ReturnType<typeof useFormContext> | null = null;
  let usingFormProvider = false;
  try {
    formContext = useFormContext();
    usingFormProvider = true;
  } catch (e) {
    // FormProvider not available
  }

  // Create local state as fallback
  const [localFormState, setLocalFormState] = useState<Record<string, unknown>>(
    propsFormState ?? {}
  );

  // Determine which form state management to use
  const effectiveFormState = usingFormProvider
    ? (formContext?.formState ?? {})
    : (propsFormState ?? localFormState);

  const effectiveSetFormState = usingFormProvider
    ? (state: Record<string, unknown>) => {
        formContext?.setFields(state as any);
      }
    : (propsSetFormState ?? setLocalFormState);

  const effectiveUpdateField = usingFormProvider
    ? (name: string, value: unknown) => {
        formContext?.setField(name as any, value as any);
      }
    : (propsUpdateField ??
      ((name: string, value: unknown) => {
        setLocalFormState((prev) => ({
          ...prev,
          [name]: value,
        }));
      }));

  const queryClient = useQueryClient();

  // -----------------------------
  // STATE
  // -----------------------------
  const [search, setSearch] = useState('');
  const [searchBy, setSearchBy] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRow, setEditingRow] = useState<Record<string, unknown> | null>(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [jsonToPreview, setJsonToPreview] = useState<Record<string, unknown> | null>(null);

  const [filtersModalOpened, setFiltersModalOpened] = useState<boolean>(false);

  const [appliedFilters, setAppliedFilters] = useState<Record<string, FilterValue | null>>({});
  const handleApplyFilter = (columnKey: string, filterValue: FilterValue | null) => {
    setAppliedFilters((prev) => ({
      ...prev,
      [columnKey]: filterValue,
    }));
  };

  const hasCreate = Boolean(tabGroups || createFields || createFieldGroups);
  const hasInlineEdit = hasCreate && !editPathBuilder;

  const fieldGroups = createFieldGroups ?? (createFields ? [{ fields: createFields }] : []);

  // -----------------------------
  // QUERY PARAMS
  // -----------------------------
  const queryParams = useMemo(() => {
    const params: Record<string, unknown> = {};

    // -----------------------------
    // FILTERS ✅ NEW
    // -----------------------------
    if (appliedFilters) {
      Object.entries(appliedFilters)
        .filter(([a, b]) => a && b)
        .forEach(([columnKey, filterValue]) => {
          params[columnKey] =
            `${filterValue?.filter.type}|${filterValue?.value}|${filterValue?.valueTo}`;
        });
    }

    if (search.trim()) {
      params.search = search.trim();
    }

    params.page = pageIndex;
    params.limit = pageSize;

    return params;
  }, [search, searchBy, appliedFilters, pageIndex, pageSize]);

  useEffect(() => {
    setPageIndex(1);
  }, [search]);

  // -----------------------------
  // DATA FETCH
  // -----------------------------
  const query = useQuery({
    queryKey: ['rxsoft-data-page', endpoint, queryParams] satisfies QueryKey,
    queryFn: async () => {
      let params: any = queryParams;
      if (moduleId === 'rxsoft' && Object.keys(queryParams).length > 2) {
        const { page, limit, ...rest } = queryParams;
        const search = JSON.stringify(rest);
        params = { page, limit, search };
      }
      const response = await apiProvider.get(endpoint, { params });
      const meta = response.data?.meta;

      setPageIndex(meta?.page ?? 1);
      setTotalItems(meta?.total ?? response.data.length);

      return response.data;
    },
  });

  const rows = transformRows
    ? transformRows(getRowsFromPayload(query.data))
    : getRowsFromPayload(query.data);

  // -----------------------------
  // MUTATIONS
  // -----------------------------
  const createMutation = useCreateMutation({
    buildCreatePayload,
    endpoint,
    formState: effectiveFormState,
    queryClient,
    setShowModal,
    title,
    apiProvider,
  });

  const updateMutation = useUpdateMutation({
    buildUpdatePayload,
    endpoint,
    formState: effectiveFormState,
    queryClient,
    setShowModal,
    title,
    setEditingRow,
    editingRow,
    apiProvider,
  });

  const deleteMutation = useDeleteMutation({
    endpoint,
    formState: effectiveFormState,
    queryClient,
    title,
    deletePathBuilder,
    apiProvider,
  });

  const exportMutation = useExportMutation({
    endpoint,
    formState: effectiveFormState,
    queryClient,
    title,
    csvEndpoint,
    apiProvider,
  });

  function openModal(row: Record<string, unknown> | null = null) {
    setEditingRow(row);
    effectiveSetFormState(buildFormState && row ? buildFormState(row) : row || defaultState || {});
    setShowModal(true);
  }

  function handleDelete() {}

  const content = (
    <>
      <HeaderBar
        open={filtersModalOpened}
        setOpen={setFiltersModalOpened}
        appliedFilters={appliedFilters}
        updateFilters={handleApplyFilter}
        columns={columns}
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalItems={totalItems}
        refresh={() => {
          query.refetch();
        }}
        search={search}
        onSearchChange={setSearch}
        customActions={renderHeaderActions?.({
          rows,
          refresh: () => {
            query.refetch();
          },
        })}
        onExport={() => {
          exportMutation.mutate();
        }}
        onCreate={
          hasCreate
            ? () => {
                createPathBuilder ? navigate({ to: createPathBuilder() }) : openModal();
              }
            : undefined
        }
      />

      <DataTable
        columns={columns}
        rows={rows}
        isLoading={query.isLoading}
        errorLoading={query.isError}
        actionCellProps={
          detailPathBuilder ||
          editPathBuilder ||
          buildUpdatePayload ||
          deletePathBuilder ||
          canDelete
            ? {
                detailPathBuilder,
                editPathBuilder,
                onEdit: buildUpdatePayload && openModal,
                onDelete: deletePathBuilder || canDelete ? () => undefined : undefined,
                deleteMutation,
              }
            : undefined
        }
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
        formState={effectiveFormState}
        setFormState={effectiveSetFormState}
        updateField={effectiveUpdateField}
        mutation={editingRow ? updateMutation : createMutation}
        modalTitle={modalTitle}
        renderCreateExtras={renderCreateExtras}
      />

      <ConfirmDialog
        title={`Delete ${title}`}
        description={`Are you sure you want to delete this ${title}? This action cannot be undone.`}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDelete}
        confirmText="Delete"
        isLoading={deleteMutation.isPending}
      />

      <JsonPreviewDialog
        value={jsonToPreview}
        title={`${title}: ${jsonToPreview?.name}`}
        open={jsonToPreview !== null}
        onOpenChange={(open) => setJsonToPreview(!open ? null : jsonToPreview)}
      />
    </>
  );

  return (
    <ModuleContext.Provider value={shellModuleContext}>
      {embedded ? (
        content
      ) : (
        <RxPage title={title} description={description}>
          {content}
        </RxPage>
      )}
    </ModuleContext.Provider>
  );
}
