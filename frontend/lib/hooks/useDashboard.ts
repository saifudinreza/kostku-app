import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface OwnerStats {
  total_properties: number;
  total_rooms: number;
  occupied_rooms: number;
  available_rooms: number;
  monthly_revenue: number;
  pending_invoices: number;
  overdue_invoices: number;
  occupancy_rate: number;
  recent_invoices: {
    id: number;
    invoice_number: string;
    status: string;
    total_amount: number;
    due_date: string;
    tenant_name: string;
    room_number: string;
  }[];
}

export interface TenantStats {
  current_room: {
    room_number: string;
    floor: number | null;
    price: number;
    property_name: string;
    property_address: string;
    property_city: string;
  } | null;
  active_tenancy: import("@/types").Tenancy | null;
  latest_invoice: import("@/types").Invoice | null;
  unpaid_count: number;
  payment_history: {
    id: number;
    amount: number;
    payment_method: string | null;
    paid_at: string;
    invoice_number: string;
  }[];
}

export function useOwnerStats() {
  return useQuery<OwnerStats>({
    queryKey: ["dashboard", "owner"],
    queryFn: async () => {
      const { data } = await api.get("/dashboard/owner");
      return data;
    },
  });
}

export function useMonthlyRevenue() {
  return useQuery<{ month: string; value: number }[]>({
    queryKey: ["dashboard", "monthly-revenue"],
    queryFn: async () => {
      const { data } = await api.get("/dashboard/monthly-revenue");
      return data;
    },
  });
}

export function useTenantStats() {
  return useQuery<TenantStats>({
    queryKey: ["dashboard", "tenant"],
    queryFn: async () => {
      const { data } = await api.get("/dashboard/tenant");
      return data;
    },
  });
}
