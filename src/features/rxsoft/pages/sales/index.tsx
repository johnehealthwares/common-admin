import { useMemo } from 'react';
import { Badge, Button, Group } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DataPageShell } from '../../../components/page/data-page-shell';
import { rxsoftApi } from '@/lib/rxsoft-api';
import { salesConfig } from './schema';

function CompleteSaleButton({ saleId }: { saleId: string }) {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => rxsoftApi.post(`/website/admin/complete-sale/${saleId}`),
    onSuccess: () => {
      notifications.show({ message: 'Sale completed — stock depleted.', color: 'green' });
      qc.invalidateQueries({ queryKey: ['rxsoft-data-page'] });
    },
    onError: (err: any) => {
      notifications.show({ message: err?.response?.data?.message ?? 'Failed to complete sale.', color: 'red' });
    },
  });

  return (
    <Button size="compact-xs" color="green" onClick={() => mutation.mutate()} loading={mutation.isPending}>
      Complete Sale
    </Button>
  );
}

export function RxSalesPage() {
  const config = useMemo(() => ({
    ...salesConfig,
    columns: [
      ...salesConfig.columns,
      {
        key: 'actions',
        label: 'Actions',
        render: (row: Record<string, unknown>) => {
          if (row.saleChannel === 'mobile' && row.status === 'draft') {
            return <CompleteSaleButton saleId={row.id as string} />;
          }
          return null;
        },
      },
    ],
  }), []);

  return <DataPageShell config={config} />;
}
