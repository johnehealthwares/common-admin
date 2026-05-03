import { ActionIcon, Group } from '@mantine/core'
import { Link } from '@tanstack/react-router'
import { Eye, Pencil, Trash2 } from 'lucide-react'

export type ActionCellProps = {
  detailPathBuilder?: (row: Record<string, unknown>) => string
  editPathBuilder?: (row: Record<string, unknown>) => string
  canDelete: boolean
  deletePathBuilder?: (row: Record<string, unknown>) => string
  hasInlineEdit: boolean
  openEditModal: (row: Record<string, unknown>) => void
  deleteMutation: any
}

export const ActionCell = ({
  detailPathBuilder,
  editPathBuilder,
  canDelete,
  row,
  hasInlineEdit,
  openEditModal,
  deleteMutation,
}: ActionCellProps & { row: Record<string, unknown> }) => {
  return (
    <Group gap="xs">
      {detailPathBuilder && (
        <ActionIcon
          variant="outline"
          component={Link}
          to={detailPathBuilder(row)}
        >
          <Eye size={16} />
        </ActionIcon>
      )}

      {editPathBuilder && (
        <ActionIcon
          variant="outline"
          component={Link}
          to={editPathBuilder(row)}
        >
          <Pencil size={16} />
        </ActionIcon>
      )}

      {!editPathBuilder && hasInlineEdit && (
        <ActionIcon
          variant="outline"
          onClick={() => openEditModal(row)}
        >
          <Pencil size={16} />
        </ActionIcon>
      )}

      {canDelete && (
        <ActionIcon
          variant="outline"
          color="red"
          loading={deleteMutation.isPending}
          onClick={() => deleteMutation.mutate(row)}
        >
          <Trash2 size={16} />
        </ActionIcon>
      )}
    </Group>
  )
}