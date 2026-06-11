import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Payment } from "@/types";

export function usePayments() {
  return useQuery<Payment[]>({
    queryKey: ["payments"],
    queryFn: async () => {
      const { data } = await api.get("/payments");
      return data.data ?? data;
    },
  });
}

export function useCreateSnapToken() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (invoiceId: number) => {
      const { data } = await api.post<{ snap_token: string; order_id: string }>(
        `/invoices/${invoiceId}/pay`
      );
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["invoices"] }),
  });
}
