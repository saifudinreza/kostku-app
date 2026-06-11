import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Tenancy } from "@/types";

export function useTenancies() {
  return useQuery<Tenancy[]>({
    queryKey: ["tenancies"],
    queryFn: async () => {
      // Backend doesn't have a standalone list endpoint; use properties → rooms → tenancies.
      // For now the owner tenants page fetches via /tenancies on each property.
      // We repurpose: get all active tenancies from invoices endpoint isn't ideal,
      // so we fetch from a dedicated endpoint if available, otherwise derive from properties.
      const { data } = await api.get("/tenancies");
      return data.data ?? data;
    },
  });
}

export function useCreateTenancy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      room_id: number;
      tenant_id?: number;
      tenant_email?: string;
      start_date: string;
      end_date?: string;
      deposit?: number;
    }) => api.post("/tenancies", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tenancies"] });
      qc.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
}

export function useEndTenancy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.post(`/tenancies/${id}/end`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tenancies"] });
      qc.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
}
