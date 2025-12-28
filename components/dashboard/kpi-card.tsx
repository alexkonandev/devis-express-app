import { LucideIcon } from "lucide-react";

interface KPICardProps {
  label: string;
  amount: number;
  count: number;
  icon: LucideIcon;
  trend?: string; // ex: "+12%"
  intent?: "neutral" | "positive" | "warning";
}

export function KPICard({
  label,
  amount,
  count,
  icon: Icon,
  trend,
  intent = "neutral",
}: KPICardProps) {
  const colors = {
    neutral: "bg-white border-zinc-200",
    positive: "bg-emerald-50/50 border-emerald-100",
    warning: "bg-amber-50/50 border-amber-100",
  };

  const iconColors = {
    neutral: "text-zinc-500 bg-zinc-100",
    positive: "text-emerald-600 bg-emerald-100",
    warning: "text-amber-600 bg-amber-100",
  };

  return (
    <div
      className={`flex flex-col p-5 rounded-xl border shadow-sm ${colors[intent]}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${iconColors[intent]}`}>
          <Icon className="w-4 h-4" />
        </div>
        {trend && (
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100/50 px-1.5 py-0.5 rounded">
            {trend}
          </span>
        )}
      </div>

      <div className="mt-auto">
        <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-1">
          {label}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-mono font-bold text-zinc-900 tracking-tight">
            {new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "EUR",
              maximumFractionDigits: 0,
            }).format(amount)}
          </span>
        </div>
        <p className="text-xs text-zinc-500 mt-1 font-medium">
          {count} document{count > 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}
