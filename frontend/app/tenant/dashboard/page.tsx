"use client";

import Link from "next/link";
import { ArrowRight, BedDouble, CalendarClock, Loader2, Wallet } from "lucide-react";
import { AiAssistant } from "@/components/shared/AiAssistant";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { useAuth } from "@/lib/auth-context";
import { useTenantStats } from "@/lib/hooks/useDashboard";
import { formatPeriode, formatRupiah, formatTanggal } from "@/lib/utils";

export default function TenantDashboard() {
  const { user } = useAuth();
  const { data, isLoading } = useTenantStats();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand" />
      </div>
    );
  }

  const firstName = user?.name?.split(" ")[0] ?? "Penghuni";
  const room = data?.current_room;
  const tenancy = data?.active_tenancy;
  const latest = data?.latest_invoice;

  return (
    <>
      <PageHeader title={`Halo, ${firstName}!`} description="Ringkasan kamar dan tagihanmu." />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-5">
            {room ? (
              <>
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-light text-brand">
                    <BedDouble className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-ink">Kamar {room.room_number}</h3>
                    <p className="text-sm text-ink-soft">
                      {room.property_name} · Lantai {room.floor ?? "-"}
                    </p>
                  </div>
                  <span className="ml-auto text-right">
                    <p className="text-lg font-bold text-ink">{formatRupiah(room.price)}</p>
                    <p className="text-xs text-ink-soft">per bulan</p>
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 border-t border-line pt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-ink-soft" />
                    <div>
                      <p className="text-xs text-ink-soft">Mulai Sewa</p>
                      <p className="font-medium text-ink">
                        {tenancy ? formatTanggal(tenancy.start_date) : "-"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-ink-soft" />
                    <div>
                      <p className="text-xs text-ink-soft">Deposit</p>
                      <p className="font-medium text-ink">
                        {tenancy?.deposit ? formatRupiah(tenancy.deposit) : "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-ink-soft">Belum ada kamar aktif.</p>
            )}
          </Card>

          {latest && (
            <Card>
              <CardHeader title="Tagihan Terbaru" action={<StatusBadge status={latest.status} />} />
              <div className="p-5">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm text-ink-soft">
                      {formatPeriode(latest.period_month, latest.period_year)}
                    </p>
                    <p className="mt-1 text-2xl font-bold text-ink">
                      {formatRupiah(latest.total_amount)}
                    </p>
                    <p className="mt-1 text-xs text-ink-soft">
                      Jatuh tempo {formatTanggal(latest.due_date)}
                    </p>
                  </div>
                  {latest.status !== "paid" && (
                    <Link href={`/tenant/invoices/${latest.id}`}>
                      <Button>
                        Bayar Sekarang
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>

        <div className="h-[28rem] lg:h-auto">
          <AiAssistant />
        </div>
      </div>
    </>
  );
}
