import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useInvoiceChat() {
  return useMutation({
    mutationFn: (payload: { invoice_id: number; message: string }) =>
      api.post<{ reply: string }>("/ai/invoice-chat", payload),
  });
}

export function useFinancialInsight() {
  return useMutation({
    mutationFn: (payload?: Record<string, unknown>) =>
      api.post<{ insight: string }>("/ai/financial-insight", payload ?? {}),
  });
}

export function useGenerateRoomDescriptionAi() {
  return useMutation({
    mutationFn: (payload: { room_number: string; floor?: number; price: number; features?: string }) =>
      api.post<{ description: string }>("/ai/generate-room-description", payload),
  });
}
