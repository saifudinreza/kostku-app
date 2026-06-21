"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useMonthlyRevenue } from "@/lib/hooks/useDashboard";
import { formatRupiah } from "@/lib/utils";

// ── Revenue Area Chart ────────────────────────────────────────────────────────

function RevenueTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-line bg-card px-4 py-3 shadow-md">
      <p className="mb-1 text-xs font-semibold text-ink-soft">{label}</p>
      <p className="text-sm font-bold text-brand">{formatRupiah(payload[0].value)}</p>
    </div>
  );
}

export function RevenueChart() {
  const { data = [], isLoading } = useMonthlyRevenue();

  if (isLoading) {
    return (
      <div className="flex h-[220px] items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex h-[220px] items-center justify-center text-sm text-ink-soft">
        Belum ada data pendapatan.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6c5ce7" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#6c5ce7" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e8e9f3" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: "#9a9db8" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#9a9db8" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}jt`}
          width={36}
        />
        <Tooltip content={<RevenueTooltip />} />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#6c5ce7"
          strokeWidth={2.5}
          fill="url(#revenueGrad)"
          dot={{ fill: "#6c5ce7", r: 3, strokeWidth: 0 }}
          activeDot={{ r: 5, fill: "#6c5ce7", strokeWidth: 2, stroke: "#fff" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ── Occupancy Pie Chart ───────────────────────────────────────────────────────

const COLORS = ["#6c5ce7", "#16a34a", "#d97706"];

const RADIAN = Math.PI / 180;
function CustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) {
  if (percent < 0.05) return null;
  const r = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central"
      fontSize={12} fontWeight={700}>
      {`${Math.round(percent * 100)}%`}
    </text>
  );
}

interface OccupancyChartProps {
  occupied: number;
  available: number;
  maintenance: number;
}

export function OccupancyChart({ occupied, available, maintenance }: OccupancyChartProps) {
  const pieData = [
    { name: "Terisi", value: occupied },
    { name: "Tersedia", value: available },
    { name: "Maintenance", value: maintenance },
  ].filter((d) => d.value > 0);

  if (!pieData.length) {
    return (
      <div className="flex h-[220px] items-center justify-center text-sm text-ink-soft">
        Belum ada data kamar.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={pieData}
          cx="50%"
          cy="45%"
          outerRadius={80}
          dataKey="value"
          labelLine={false}
          label={CustomLabel}
        >
          {pieData.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value) => (
            <span style={{ fontSize: 12, color: "#5a5d78" }}>{value}</span>
          )}
        />
        <Tooltip
          formatter={(value, name) => [`${value} kamar`, name]}
          contentStyle={{
            borderRadius: 12,
            border: "1px solid #e8e9f3",
            fontSize: 12,
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
