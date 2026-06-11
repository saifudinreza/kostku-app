import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Property } from "@/types";

export function useProperties() {
  return useQuery<Property[]>({
    queryKey: ["properties"],
    queryFn: async () => {
      const { data } = await api.get("/properties");
      return data.data ?? data;
    },
  });
}

export function useProperty(id: number) {
  return useQuery<Property>({
    queryKey: ["properties", id],
    queryFn: async () => {
      const { data } = await api.get(`/properties/${id}`);
      return data.data ?? data;
    },
    enabled: !!id,
  });
}

export function useCreateProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Property>) => api.post("/properties", payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["properties"] }),
  });
}

export function useUpdateProperty(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Property>) =>
      api.put(`/properties/${id}`, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["properties"] }),
  });
}

export function useDeleteProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/properties/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["properties"] }),
  });
}
