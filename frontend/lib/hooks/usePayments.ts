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
    mutationFn: async ({
      invoiceId,
      enabledPayments,
    }: {
      invoiceId: number;
      enabledPayments?: string[];
    }) => {
      const { data } = await api.post<{
        snap_token: string;
        client_key: string;
        order_id: string;
      }>(`/invoices/${invoiceId}/pay`, {
        ...(enabledPayments?.length ? { enabled_payments: enabledPayments } : {}),
      });
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["invoices"] }),
  });
}

/**
 * Query Midtrans langsung untuk status terbaru lalu sync ke DB.
 * Solusi utama untuk localhost di mana webhook Midtrans tidak bisa masuk.
 */
export function useCheckPaymentStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (invoiceId: number) => {
      const { data } = await api.post<{
        transaction_status: string;
        payment_status: string;
        invoice_status: string;
      }>(`/invoices/${invoiceId}/check-status`);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["invoices"] });
      qc.invalidateQueries({ queryKey: ["payments"] });
    },
  });
}
