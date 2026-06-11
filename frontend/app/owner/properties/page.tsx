import { Building2, MapPin, Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { properties, rooms } from "@/lib/mock";
import { formatRupiah } from "@/lib/utils";

export default function PropertiesPage() {
  return (
    <>
      <PageHeader
        title="Properti"
        description="Kelola semua kost milikmu."
        action={
          <Button>
            <Plus className="h-4 w-4" />
            Tambah Properti
          </Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-2">
        {properties.map((p) => {
          const propRooms = rooms.filter((r) => r.property_id === p.id);
          const occupied = propRooms.filter(
            (r) => r.status === "occupied"
          ).length;
          const minPrice = Math.min(...propRooms.map((r) => r.price));

          return (
            <Card key={p.id} className="overflow-hidden">
              <div className="flex h-32 items-center justify-center bg-gradient-to-br from-brand to-brand-dark">
                <Building2 className="h-12 w-12 text-white/80" />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-ink">{p.name}</h3>
                  <span className="rounded-badge bg-brand-light px-2.5 py-0.5 text-xs font-medium text-brand">
                    {p.rooms_count} kamar
                  </span>
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-soft">
                  <MapPin className="h-4 w-4" />
                  {p.address}, {p.city}
                </p>

                <div className="mt-4 grid grid-cols-3 gap-3 border-t border-line pt-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-ink">{occupied}</p>
                    <p className="text-xs text-ink-soft">Terisi</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-ink">
                      {propRooms.length - occupied}
                    </p>
                    <p className="text-xs text-ink-soft">Kosong</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-ink">
                      {formatRupiah(minPrice)}
                    </p>
                    <p className="text-xs text-ink-soft">Mulai dari</p>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Daftar kamar */}
      <Card className="p-5">
        <h3 className="text-[18px] font-semibold text-ink">Semua Kamar</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((r) => {
            const prop = properties.find((p) => p.id === r.property_id);
            return (
              <div
                key={r.id}
                className="flex items-center justify-between rounded-lg border border-line p-4"
              >
                <div>
                  <p className="font-semibold text-ink">Kamar {r.room_number}</p>
                  <p className="text-xs text-ink-soft">
                    {prop?.name} · Lantai {r.floor}
                  </p>
                  <p className="mt-1 text-sm font-medium text-brand">
                    {formatRupiah(r.price)}/bln
                  </p>
                </div>
                <StatusBadge status={r.status} />
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
}
