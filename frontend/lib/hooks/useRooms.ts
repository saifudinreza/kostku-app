import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Room } from "@/types";

export function useAllRooms() {
  return useQuery<Room[]>({
    queryKey: ["rooms", "all"],
    queryFn: async () => {
      const { data } = await api.get("/rooms");
      return data.data ?? data;
    },
  });
}

export function useRooms(propertyId: number) {
  return useQuery<Room[]>({
    queryKey: ["rooms", propertyId],
    queryFn: async () => {
      const { data } = await api.get(`/properties/${propertyId}/rooms`);
      return data.data ?? data;
    },
    enabled: !!propertyId,
  });
}

export function useRoom(id: number) {
  return useQuery<Room>({
    queryKey: ["rooms", "detail", id],
    queryFn: async () => {
      const { data } = await api.get(`/rooms/${id}`);
      return data.data ?? data;
    },
    enabled: !!id,
  });
}

export function useCreateRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Room>) => api.post("/rooms", payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rooms"] }),
  });
}

export function useUpdateRoom(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Room>) => api.put(`/rooms/${id}`, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rooms"] }),
  });
}

export function useDeleteRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/rooms/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rooms"] }),
  });
}

export function useGenerateRoomDescription() {
  return useMutation({
    mutationFn: (payload: { room_number: string; floor?: number; price: number; features?: string }) =>
      api.post<{ description: string }>("/rooms/generate-description", payload),
  });
}
