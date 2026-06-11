import Link from "next/link";
import { ArrowRight, BedDouble, CalendarClock, Wallet } from "lucide-react";
import { AiAssistant } from "@/components/shared/AiAssistant";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import {
  currentTenant,
  invoices,
  properties,
  rooms,
  tenancies,
} from "@/lib/mock";
import { formatPeriode, formatRupiah, formatTanggal } from "@/lib/utils";

export default function TenantDashboard() {
  const tenancy = tenancies.find((t) => t.tenant_id === currentTenant.id);
  const room = rooms.find((r) => r.id === tenancy?.room_id);
  const property = properties.find((p) => p.id === room?.property_id);
  const myInvoices = invoices
    .filter((i) => i.tenancy_id === tenancy?.id)
    .sort((a, b) => b.id - a.id);
  const latest = myInvoices[0];

  return (
    <>
      <PageHeader
        title={`Halo, ${currentTenant.name.split(" ")[0]}!`}
        description="Ringkasan kamar dan tagihanmu."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Info kamar */}
          <Card className="p-5">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-light text-brand">
                <BedDouble className="h-6 w-6" />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-ink">
                  Kamar {room?.room_number}
                </h3>
                <p className="text-sm text-ink-soft">
                  {property?.name} · Lantai {room?.floor}
                </p>
              </div>
              <span className="ml-auto text-right">
                <p className="text-lg font-bold text-ink">
                  {room ? formatRupiah(room.price) : "-"}
                </p>
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
          </Card>

          {/* Tagihan terbaru */}
          {latest && (
            <Card>
              <CardHeader
                title="Tagihan Terbaru"
                action={<StatusBadge status={latest.status} />}
              />
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

        {/* AI assistant */}
        <div className="h-[28rem] lg:h-auto">
          <AiAssistant />
        </div>
      </div>
    </>
  );
}
