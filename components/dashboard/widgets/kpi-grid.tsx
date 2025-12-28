import { AdvancedDashboardData } from "@/app/actions/dashboard.actions";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const StudioValue = ({
  value,
  size = "md",
}: {
  value: number;
  size?: "sm" | "md" | "lg" | "xl";
}) => {
  const sizes = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
    xl: "text-3xl",
  };
  return (
    <span
      className={cn(
        "font-mono font-bold text-zinc-900 tracking-tighter",
        sizes[size]
      )}
    >
      {new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
      }).format(value)}
    </span>
  );
};

const StudioCard = ({ title, children, className }: any) => (
  <div
    className={cn(
      "bg-white border border-zinc-200 rounded-sm flex flex-col",
      className
    )}
  >
    {title && (
      <div className="px-4 py-3 border-b border-zinc-100 shrink-0 bg-zinc-50/30">
        <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
          {title}
        </span>
      </div>
    )}
    <div className="p-4 flex-1">{children}</div>
  </div>
);

export function KpiGrid({ data }: { data: AdvancedDashboardData }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
      {/* REVENU */}
      <StudioCard title="Chiffre d'Affaires" className="md:col-span-2">
        <div className="flex items-end justify-between mt-1">
          <div className="flex flex-col gap-1">
            <StudioValue value={data.kpi.revenue.total} size="xl" />
            <div className="flex items-center gap-2 mt-1">
              <span
                className={cn(
                  "text-[10px] font-bold px-1.5 py-0.5 rounded-sm border",
                  data.kpi.revenue.growth >= 0
                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                    : "bg-red-50 text-red-700 border-red-100"
                )}
              >
                {data.kpi.revenue.growth > 0 ? "+" : ""}
                {data.kpi.revenue.growth}%
              </span>
              <span className="text-[10px] text-zinc-400 font-medium">
                vs mois dernier
              </span>
            </div>
          </div>
          {/* Mini Chart visuel */}
          <div className="flex items-end gap-1 h-12 w-32 pb-1">
            {data.chartData.slice(-6).map((d, i) => (
              <div
                key={i}
                className="flex-1 bg-zinc-100 h-full flex items-end rounded-[1px]"
              >
                <div
                  style={{
                    height: `${
                      (d.amount /
                        (Math.max(...data.chartData.map((c) => c.amount)) ||
                          1)) *
                      100
                    }%`,
                  }}
                  className={cn(
                    "w-full rounded-[1px]",
                    i === 5 ? "bg-zinc-900" : "bg-zinc-300"
                  )}
                />
              </div>
            ))}
          </div>
        </div>
      </StudioCard>

      {/* PIPELINE */}
      <StudioCard title="Pipeline">
        <div className="flex flex-col h-full justify-between">
          <StudioValue value={data.kpi.pipeline.total} size="lg" />
          <div className="flex items-center gap-2 mt-4 text-zinc-500">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">
              {data.kpi.pipeline.count} devis en cours
            </span>
          </div>
        </div>
      </StudioCard>

      {/* PERFORMANCE */}
      <StudioCard title="Performance">
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-xs text-zinc-500 font-medium">
              Panier Moyen
            </span>
            <StudioValue value={data.kpi.averageTicket} size="sm" />
          </div>
          <div className="w-full h-px bg-zinc-100" />
          <div className="flex justify-between items-end">
            <span className="text-xs text-zinc-500 font-medium">
              Conversion
            </span>
            <span className="font-mono font-bold text-sm text-zinc-900">
              {data.kpi.conversionRate}%
            </span>
          </div>
        </div>
      </StudioCard>
    </div>
  );
}
