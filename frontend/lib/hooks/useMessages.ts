import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Message } from "@/types";

export function useMessages(tenancyId?: number) {
  return useQuery<Message[]>({
    queryKey: ["messages", tenancyId],
    queryFn: async () => {
      const params = tenancyId ? { tenancy_id: tenancyId } : {};
      const { data } = await api.get("/messages", { params });
      return data.data ?? data;
    },
    refetchInterval: 5000, // poll every 5s for new messages
  });
}

export function useSendMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      receiver_id: number;
      tenancy_id: number;
      body: string;
    }) => api.post("/messages", payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["messages"] }),
  });
}

export function useMarkMessagesRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (tenancyId: number) =>
      api.post("/messages/mark-read", { tenancy_id: tenancyId }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["messages"] }),
  });
}
