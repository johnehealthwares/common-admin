import { ActionIcon, Group } from '@mantine/core';
import { Link } from '@tanstack/react-router';
import { Eye, Pencil, RotateCcw, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { refundData } from '@/registry/fields';

export type ActionCellProps = {
  rowIndex?: number;
  detailPathBuilder?: (row: Record<string, unknown>) => string;
  editPathBuilder?: (row: Record<string, unknown>) => string;
  deletePathBuilder?: (row: Record<string, unknown>) => string;
  viewPathBuilder?: (row: Record<string, unknown>) => string;
  onEdit?: (row: Record<string, unknown>, index: number) => void;
  onDelete?: (row: Record<string, unknown>, index: number) => void;
  onView?: (row: Record<string, unknown>) => void;
  deleteMutation?: any;
  saveRow?: (row: any) => Promise<void>;
  resetRow?: (rowIndex: string) => void;
  savingRowIndex?: string | null;
  actions?: any[];
};

export const ActionCell = ({
  detailPathBuilder,
  editPathBuilder,
  deletePathBuilder,
  viewPathBuilder,
  row,
  onEdit,
  onDelete,
  onView,
  deleteMutation,
  rowIndex,
  savingRowIndex,
  saveRow,
  resetRow,
}: ActionCellProps & { row: Record<string, unknown> }) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const handleDelete = () => {
    if (deleteMutation) {
      if (deleteMutation.mutateAsync) {
        deleteMutation.mutateAsync(row).then(() => {
          onDelete && onDelete(row, rowIndex || 0);
        });
      } else {
        deleteMutation.mutate(row, {
          onSuccess: () => onDelete && onDelete(row, rowIndex || 0),
        });
      }
    } else {
      onDelete && onDelete(row, rowIndex || 0);
    }
    setIsDeleteOpen(false);
  };

  return (
    <Group gap="xs">
      {detailPathBuilder && (
        <ActionIcon variant="outline" component={Link} to={detailPathBuilder(row)}>
          <Eye size={16} />
        </ActionIcon>
      )}

      {editPathBuilder && (
        <ActionIcon variant="outline" component={Link} to={editPathBuilder(row)}>
          <Pencil size={16} />
        </ActionIcon>
      )}

      {!editPathBuilder && onEdit && (
        <ActionIcon variant="outline" onClick={() => onEdit(row, rowIndex || 0)}>
          <Pencil size={16} />
        </ActionIcon>
      )}

      {onView && (
        <ActionIcon variant="outline" onClick={() => onView(row)}>
          <Eye size={16} />
        </ActionIcon>
      )}

      {onDelete && (
        <ActionIcon
          variant="outline"
          color="red"
          loading={deleteMutation && deleteMutation.isPending}
          onClick={() => setIsDeleteOpen(true)}
        >
          <Trash2 size={16} />
        </ActionIcon>
      )}

      {saveRow && (
        <ActionIcon
          variant="light"
          color="green"
          loading={savingRowIndex === row.id}
          disabled={!row.dirty || savingRowIndex !== null}
          onClick={() => {
            saveRow(row);
          }}
        >
          <Save size={16} />
        </ActionIcon>
      )}
      {resetRow && (
        <ActionIcon
          variant="light"
          disabled={!row.dirty || savingRowIndex !== null}
          onClick={() => resetRow(row.id as string)}
        >
          <RotateCcw size={16} />
        </ActionIcon>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      <ConfirmDialog
        title={`Delete Item`}
        description={`Are you sure you want to delete this ${'item'}? This action cannot be undone.`}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDelete}
        confirmText="Delete"
        isLoading={deleteMutation && deleteMutation.isPending}
      />
    </Group>
  );
};
