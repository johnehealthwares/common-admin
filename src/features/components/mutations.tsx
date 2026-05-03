import { downloadBlob, rxsoftApi } from "@/lib/rxsoft-api"
import { notifications } from "@mantine/notifications"
import { useMutation } from "@tanstack/react-query"

type MutationProps = {
   
    endpoint: string
    formState: Record<string, unknown>
    queryClient: any
    title: any,
}

type CreateMutationProps = MutationProps & {
     buildCreatePayload?: (values: Record<string, unknown>) => unknown
    buildUpdatePayload?: (
        values: Record<string, unknown>,
        row: Record<string, unknown>
    ) => unknown
        setShowModal: (value: boolean) => void

    onCreateSuccess?: (
        created: Record<string, unknown>,
        values: Record<string, unknown>
    ) => Promise<void> | void
    setFormState: (values: Record<string, unknown>) => void

}

type UpdateMutationProps = MutationProps & {
     buildCreatePayload?: (values: Record<string, unknown>) => unknown

     buildUpdatePayload?: (
    values: Record<string, unknown>,
    row: Record<string, unknown>
  ) => unknown
    editingRow: Record<string, unknown> | null
    setEditingRow: (row: Record<string, unknown> | null) => void
        setFormState: (values: Record<string, unknown>) => void
    setShowModal: (value: boolean) => void

}

type DeteleMutationProps = MutationProps &{
    deletePathBuilder?: (row: Record<string, unknown>) => string
    queryClient: any,
}

type ExportMutationProps = MutationProps & {
    csvEndpoint?: string,
}

export const useCreateMutation = ({
    buildCreatePayload,
    onCreateSuccess,
    endpoint,
    formState,
    queryClient,
    setShowModal,
    setFormState,
    title,
}: CreateMutationProps) => useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
        const payload = buildCreatePayload ? buildCreatePayload(values) : values
        const response = await rxsoftApi.post(endpoint, payload)
        return response.data as Record<string, unknown>
    },
    onSuccess: async (created) => {
        if (onCreateSuccess) {
            await onCreateSuccess(created, formState)
        }
        void queryClient.invalidateQueries({
            queryKey: ['rxsoft-data-page', endpoint],
        })
        setShowModal(false)
        setFormState({})
        notifications.show({message: `${title} record created`})
    },
    onError: (error: any) => {
         notifications.show({color: 'red', message: `Failed to create ${title.toLowerCase()} record - ${error?.data?.error?.message ?? error?.response?.data?.error?.message ?? error.message}`})
    },
})


export const useUpdateMutation = ({
    buildCreatePayload,
    endpoint,
    queryClient,
    setFormState,
    title,
    buildUpdatePayload,
    setEditingRow,
    editingRow,
    setShowModal,
}: UpdateMutationProps) => {
    
    return useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
        console.log({values, buildUpdatePayload, buildCreatePayload, editingRow})
        if (!editingRow?.id) throw new Error('Missing record id')
        const payload = buildUpdatePayload
            ? buildUpdatePayload(values, editingRow)
            : buildCreatePayload
                ? buildCreatePayload(values)
                : values
        const response = await rxsoftApi.put(
            `${endpoint}/${String(editingRow.id)}`,
            payload
        )
        return response.data as Record<string, unknown>
    },
    onSuccess: () => {
        void queryClient.invalidateQueries({
            queryKey: ['rxsoft-data-page', endpoint],
        })
        setShowModal(false)
        setEditingRow(null)
        setFormState({})
        notifications.show({message:`${title} record updated`})
    },
    onError: (error: any) => {
        console.log(error.response)

         notifications.show({message: `Failed to update ${title.toLowerCase()} record - ${error?.data?.error?.message ?? error?.response?.data?.error?.message}`})
    },
})
}


export  const useDeleteMutation = ({
    deletePathBuilder,
    endpoint,
    queryClient,
    title,
  
  }: DeteleMutationProps) => useMutation({
    mutationFn: async (row: Record<string, unknown>) => {
      const target = deletePathBuilder
        ? deletePathBuilder(row)
        : `${endpoint}/${String(row.id)}`
      await rxsoftApi.delete(target)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['rxsoft-data-page', endpoint],
      })
     notifications.show({message: `${title} record deleted`})
    },
    onError: () => {
      notifications.show({color: 'red', message: `Failed to delete ${title.toLowerCase()} record`})
    },
  })

export  const useExportMutation = ({
    csvEndpoint,
    title,
}: ExportMutationProps) => useMutation({
    mutationFn: async () => {
      if (!csvEndpoint) return
      await downloadBlob(
        { method: 'GET', url: csvEndpoint },
        `${title.toLowerCase().replace(/\s+/g, '_')}.csv`
      )
    },
    onSuccess: () => notifications.show({message: `${title} export downloaded`}),
    onError: () => notifications.show({color: 'red', message: `Failed to export ${title.toLowerCase()}`}),
  })
