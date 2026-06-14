import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Room, RoomImage } from "@/types";

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

export function useUploadRoomImage(roomId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.append("image", file);
      const { data } = await api.post<RoomImage>(`/rooms/${roomId}/images`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rooms"] }),
  });
}

export function useDeleteRoomImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (imageId: number) => api.delete(`/room-images/${imageId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rooms"] }),
  });
}

export function useSetPrimaryImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (imageId: number) => api.put(`/room-images/${imageId}/primary`, {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rooms"] }),
  });
}

export function useExportInvoicesCsv() {
  return useMutation({
    mutationFn: async () => {
      const res = await api.get("/export/invoices/csv", { responseType: "blob" });
      const url  = URL.createObjectURL(new Blob([res.data]));
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `tagihan-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    },
  });
}

export function useExportPaymentsCsv() {
  return useMutation({
    mutationFn: async () => {
      const res = await api.get("/export/payments/csv", { responseType: "blob" });
      const url  = URL.createObjectURL(new Blob([res.data]));
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `pembayaran-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    },
  });
}
