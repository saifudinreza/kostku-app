import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

// Tenant: tanya soal tagihan → POST /api/ai/invoice-chat
export function useInvoiceChat() {
  return useMutation({
    mutationFn: (message: string) =>
      api.post<{ answer: string }>("/ai/invoice-chat", { message }),
  });
}

// Owner: insight keuangan → POST /api/ai/financial-insight
export function useFinancialInsight() {
  return useMutation({
    mutationFn: (message: string) =>
      api.post<{ answer: string }>("/ai/financial-insight", { message }),
  });
}

export function useGenerateRoomDescriptionAi() {
  return useMutation({
    mutationFn: (payload: {
      room_number: string;
      floor?: number;
      price: number;
      facilities?: string[];
      size?: string;
    }) => api.post<{ description: string }>("/ai/generate-room-description", payload),
  });
}
