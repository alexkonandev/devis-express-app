"use client";

import React, { useState } from "react";
import { GripVertical, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { UIItem } from "@/types/explorer";

interface DraggableTemplateCardProps {
  item: UIItem;
}

export const DraggableTemplateCard = ({ item }: DraggableTemplateCardProps) => {
  const [isDragging, setIsDragging] = useState(false);

  // Début du Drag : On capture les données
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true);

    // Transfert de données standard HTML5
    // On passe l'objet complet sérialisé + un identifiant clair
    e.dataTransfer.setData("application/json", JSON.stringify(item));
    e.dataTransfer.setData("text/plain", item.id);

    // Effet visuel sur le curseur
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={cn(
        "group relative flex flex-col justify-between p-4 bg-white rounded-xl border border-zinc-200 transition-all duration-200 select-none",
        // Styles Interactifs
        "hover:border-indigo-300 hover:shadow-md cursor-grab active:cursor-grabbing",
        // Styles durant le Drag
        isDragging &&
          "opacity-50 border-indigo-400 shadow-none ring-2 ring-indigo-100 rotate-2 scale-95"
      )}
    >
      {/* Header : Grip & Prix */}
      <div className="flex justify-between items-start mb-3">
        <div className="p-1 rounded-md text-zinc-300 group-hover:text-indigo-400 transition-colors">
          <GripVertical className="w-4 h-4" />
        </div>
        <div className="font-mono text-xs font-bold text-zinc-700 bg-zinc-50 px-2 py-1 rounded border border-zinc-100 group-hover:border-indigo-100 group-hover:text-indigo-700 transition-colors">
          {item.defaultPrice} €
        </div>
      </div>

      {/* Corps : Info Service */}
      <div>
        <h4 className="font-bold text-sm text-zinc-900 leading-tight mb-1.5 group-hover:text-indigo-600 transition-colors">
          {item.title}
        </h4>
        <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
          {item.description}
        </p>
      </div>

      {/* Footer : Catégorie discrète */}
      <div className="mt-4 pt-3 border-t border-zinc-50 flex items-center gap-1.5">
        <Tag className="w-3 h-3 text-zinc-300" />
        <span className="text-[10px] uppercase font-medium text-zinc-400 tracking-wide">
          {item.category}
        </span>
      </div>
    </div>
  );
};
