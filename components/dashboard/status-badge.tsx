import { cn } from "@/lib/utils";
import { Check, Clock, FileText, Send, XCircle } from "lucide-react";

export function StatusBadge({ status }: { status: string }) {
  // Mapping strict basé sur ton Schema Prisma (String)
  const styles: Record<string, string> = {
    draft: "bg-zinc-100 text-zinc-600 border-zinc-200",
    sent: "bg-blue-50 text-blue-700 border-blue-200",
    accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
    archived:
      "bg-zinc-50 text-zinc-400 border-zinc-100 decoration-slice line-through",
  };

  const labels: Record<string, string> = {
    draft: "Brouillon",
    sent: "Envoyé",
    accepted: "Signé",
    rejected: "Refusé",
    archived: "Archivé",
  };

  const Icons: Record<string, any> = {
    draft: FileText,
    sent: Send,
    accepted: Check,
    rejected: XCircle,
    archived: FileText,
  };

  const Icon = Icons[status] || FileText;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide border",
        styles[status] || styles.draft
      )}
    >
      <Icon className="w-3 h-3" />
      {labels[status] || status}
    </span>
  );
}
