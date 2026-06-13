import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { rxsoftApi } from '@/lib/rxsoft-api';
import type { CreateSaleDto } from '../types';

export const salesKeys = {
  list: ['sales'] as any,
  detail: (id: string) => ['sales', id] as const,
};

export const customerKeys = {
  list: (search?: string) => ['customers', search] as any,
};

export const priceListKeys = {
  list: (search?: string) => ['price-lists', search] as any,
  items: (id?: string) => ['price-list-items', id] as any,
};

export const paymentMethodKeys = {
  list: ['payment-methods'] as any,
};

export async function createSale(payload: CreateSaleDto) {
  const { data } = await rxsoftApi.post('/sales', payload);
  return data;
}

export async function fetchSales() {
  const { data } = await rxsoftApi.get('/sales');
  return data;
}

export function useCreateSale(options?: { onSuccess?: (data: any) => void }) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSaleDto) => createSale(payload),
    onSuccess: (data) => {
      qc.invalidateQueries(salesKeys.list);
      options?.onSuccess?.(data);
    },
  });
}

export function useSales() {
  return useQuery({
    queryKey: salesKeys.list,
    queryFn: fetchSales,
    staleTime: 1000 * 30,
  });
}

export function useSale(id?: string) {
  return useQuery({
    queryKey: id ? salesKeys.detail(id) : (['sales', 'undefined'] as const),
    queryFn: async () => {
      if (!id) return null;
      const { data } = await rxsoftApi.get(`/sales/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCustomers(search?: string) {
  return useQuery({
    queryKey: customerKeys.list(search),
    queryFn: async () => {
      const { data } = await rxsoftApi.get('/customers', {
        params: { search, limit: 20 },
      });
      return data?.data ?? data ?? [];
    },
    staleTime: 60_000,
  });
}

export function usePriceLists(search?: string) {
  return useQuery({
    queryKey: priceListKeys.list(search),
    queryFn: async () => {
      const { data } = await rxsoftApi.get('/price-lists/search', {
        params: { search, limit: 20 },
      });
      return data?.data ?? data ?? [];
    },
    staleTime: 60_000,
  });
}

export function usePriceListItems(priceListId?: string) {
  return useQuery({
    queryKey: priceListKeys.items(priceListId),
    queryFn: async () => {
      if (!priceListId) return [];
      const { data } = await rxsoftApi.get(`/price-lists/${priceListId}/items`, {
        params: { limit: 100000 },
      });
      return data?.data ?? data ?? [];
    },
    enabled: !!priceListId,
    staleTime: 60_000,
  });
}

export function usePaymentMethods() {
  return useQuery({
    queryKey: paymentMethodKeys.list,
    queryFn: async () => {
      const { data } = await rxsoftApi.get('/payment-methods', {
        params: { limit: 50 },
      });
      return data?.data ?? data ?? [];
    },
    staleTime: 60_000,
  });
}

export function useCreateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { name: string; phone?: string }) => {
      const { data } = await rxsoftApi.post('/customers', payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries(customerKeys.list());
    },
  });
}
