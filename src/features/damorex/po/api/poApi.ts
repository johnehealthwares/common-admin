import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { rxsoftApi } from '@/lib/rxsoft-api';

export const poKeys = {
  list: (search?: string) => ['purchase-orders', search || ''] as any,
  detail: (id?: string) => ['purchase-orders', id || ''] as any,
};

export const receiptKeys = {
  byPo: (poId: string) => ['goods-receipts', poId] as any,
};

export function usePurchaseOrders(search?: string) {
  return useQuery({
    queryKey: poKeys.list(search),
    queryFn: async () => {
      const { data } = await rxsoftApi.get('/purchases', {
        params: { search: search || '', limit: 50 },
      });
      return data?.data ?? data ?? [];
    },
    staleTime: 30_000,
  });
}

export function usePurchaseOrder(id?: string) {
  return useQuery({
    queryKey: poKeys.detail(id),
    queryFn: async () => {
      if (!id) return null;
      const { data } = await rxsoftApi.get(`/purchases/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreatePurchaseOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await rxsoftApi.post('/purchases', payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries(poKeys.list());
    },
  });
}

export function useSuppliers(search?: string) {
  return useQuery({
    queryKey: ['suppliers', search],
    queryFn: async () => {
      const { data } = await rxsoftApi.get('/customers', {
        params: { search, limit: 20 },
      });
      return data?.data ?? data ?? [];
    },
    staleTime: 60_000,
  });
}

export function useWarehouses(search?: string) {
  return useQuery({
    queryKey: ['warehouses', search],
    queryFn: async () => {
      const { data } = await rxsoftApi.get('/stock-locations/search', {
        params: { search, limit: 20 },
      });
      return data?.data ?? data ?? [];
    },
    staleTime: 60_000,
  });
}

export function useReceiveGoods() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ poId, payload }: { poId: string; payload: any }) => {
      const { data } = await rxsoftApi.post(`/purchases/${poId}/receive`, payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries(poKeys.list());
      qc.invalidateQueries(receiptKeys.byPo(''));
    },
  });
}

export function useReceipts(poId?: string) {
  return useQuery({
    queryKey: receiptKeys.byPo(poId || ''),
    queryFn: async () => {
      if (!poId) return [];
      const { data } = await rxsoftApi.get(`/purchases/${poId}/receipts`);
      return data?.data ?? data ?? [];
    },
    enabled: !!poId,
  });
}

export function useItems(search?: string) {
  return useQuery({
    queryKey: ['catalog-items', search],
    queryFn: async () => {
      const { data } = await rxsoftApi.get('/items', {
        params: { search, limit: 20 },
      });
      return data?.data ?? data ?? [];
    },
    staleTime: 60_000,
  });
}
