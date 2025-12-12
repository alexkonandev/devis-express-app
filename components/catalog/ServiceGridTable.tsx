"use client";

import { ServiceItem, ItemInput } from "@/lib/types";
import {
  EditableTextCell,
  EditablePriceCell,
  CategorySelectCell,
  TaxToggleCell,
} from "./cells";
import { PackageOpen, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceGridTableProps {
  items: ServiceItem[];
  onUpdate: (id: string, field: keyof ItemInput, value: any) => void;
}

export const ServiceGridTable = ({
  items,
  onUpdate,
}: ServiceGridTableProps) => {
  return (
    // Bordures plus nettes (border-zinc-200 au lieu de zinc-50)
    <div className="w-full h-full overflow-auto border border-zinc-200 bg-white shadow-sm rounded-lg">
      <table className="min-w-[1100px] w-full border-collapse table-fixed text-left text-sm">
        {/* Header : Fond plus opaque, Texte plus grand et plus sombre */}
        <thead className="bg-zinc-50 sticky top-0 z-20 border-b border-zinc-200">
          <tr className="h-10">
            <th className="w-[100px] px-4 font-bold text-[11px] text-zinc-600 uppercase tracking-wide select-none border-r border-zinc-200">
              RÉF
            </th>
            <th className="w-[280px] px-4 font-bold text-[11px] text-zinc-600 uppercase tracking-wide select-none border-r border-zinc-200">
              SERVICE
            </th>
            <th className="w-[400px] px-4 font-bold text-[11px] text-zinc-600 uppercase tracking-wide select-none border-r border-zinc-200">
              DESCRIPTION
            </th>
            <th className="w-[140px] px-4 font-bold text-[11px] text-zinc-600 uppercase tracking-wide text-center select-none border-r border-zinc-200">
              CATÉGORIE
            </th>
            <th className="w-[80px] px-4 font-bold text-[11px] text-zinc-600 uppercase tracking-wide text-center select-none border-r border-zinc-200">
              TVA
            </th>
            <th className="w-[120px] px-4 font-bold text-[11px] text-zinc-600 uppercase tracking-wide text-right select-none">
              PRIX
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-zinc-200">
          {items.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="h-64 text-center text-zinc-500 italic bg-zinc-50/30"
              >
                <div className="flex flex-col items-center justify-center gap-3">
                  <PackageOpen className="w-10 h-10 text-zinc-300" />
                  <span className="font-medium">
                    Aucune donnée. Importez depuis l'ontologie.
                  </span>
                </div>
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr
                key={item.id}
                className="h-12 group hover:bg-zinc-50 transition-colors border-b border-zinc-100"
              >
                {/* ID : Couleur plus lisible (zinc-500 au lieu de zinc-300) */}
                <td className="px-4 border-r border-zinc-100 font-mono text-[11px] font-medium text-zinc-500 truncate select-all bg-zinc-50/30">
                  {item.id.slice(-6).toUpperCase()}
                </td>

                {/* TITLE */}
                <td className="border-r border-zinc-100 p-0 relative h-12 group/cell hover:bg-indigo-50/30 transition-colors cursor-text">
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/cell:opacity-100 transition-opacity pointer-events-none">
                    <Pencil className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                  <EditableTextCell
                    value={item.title}
                    onSave={(val) => onUpdate(item.id, "title", val)}
                    className="font-semibold text-zinc-900 text-sm px-4 h-full flex items-center"
                    placeholder="Nom du service..."
                  />
                </td>

                {/* DESCRIPTION : Texte plus grand (text-sm) */}
                <td className="border-r border-zinc-100 p-0 relative h-12 group/cell hover:bg-indigo-50/30 transition-colors cursor-text">
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/cell:opacity-100 transition-opacity pointer-events-none">
                    <Pencil className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                  <EditableTextCell
                    value={item.description || ""}
                    onSave={(val) => onUpdate(item.id, "description", val)}
                    className="text-zinc-600 text-sm font-normal px-4 h-full flex items-center truncate"
                    placeholder="—"
                  />
                </td>

                {/* CATEGORY */}
                <td className="border-r border-zinc-100 p-0 relative h-12 hover:bg-zinc-100 transition-colors">
                  <CategorySelectCell
                    value={item.category}
                    onSave={(val) => onUpdate(item.id, "category", val)}
                  />
                </td>

                {/* TVA */}
                <td className="border-r border-zinc-100 p-0 relative h-12 hover:bg-zinc-100 transition-colors">
                  <TaxToggleCell
                    isTaxable={item.isTaxable}
                    onToggle={() =>
                      onUpdate(item.id, "isTaxable", !item.isTaxable)
                    }
                  />
                </td>

                {/* PRICE */}
                <td className="p-0 relative h-12 group/cell hover:bg-indigo-50/30 transition-colors cursor-text">
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/cell:opacity-100 transition-opacity pointer-events-none">
                    <Pencil className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                  <EditablePriceCell
                    value={item.unitPriceEuros}
                    onSave={(val) => onUpdate(item.id, "unitPriceEuros", val)}
                  />
                </td>
              </tr>
            ))
          )}

          {/* Lignes vides décoratives */}
          {Array.from({ length: Math.max(0, 10 - items.length) }).map(
            (_, i) => (
              <tr key={`ghost-${i}`} className="h-12 border-b border-zinc-100">
                <td className="border-r border-zinc-100 bg-zinc-50/20"></td>
                <td className="border-r border-zinc-100"></td>
                <td className="border-r border-zinc-100"></td>
                <td className="border-r border-zinc-100"></td>
                <td className="border-r border-zinc-100"></td>
                <td></td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};
  