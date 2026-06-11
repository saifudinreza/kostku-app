import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Invoice } from "@/types";

export function useInvoices() {
  return useQuery<Invoice[]>({
    queryKey: ["invoices"],
    queryFn: async () => {
      const { data } = await api.get("/invoices");
      return data.data ?? data;
    },
  });
}

export function useInvoice(id: number) {
  return useQuery<Invoice>({
    queryKey: ["invoices", id],
    queryFn: async () => {
      const { data } = await api.get(`/invoices/${id}`);
      return data.data ?? data;
    },
    enabled: !!id,
  });
}

export function useCreateInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Invoice>) => api.post("/invoices", payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["invoices"] }),
  });
}

export function useGenerateMonthlyInvoices() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload?: { month?: number; year?: number }) =>
      api.post("/invoices/generate-monthly", payload ?? {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["invoices"] }),
  });
}
