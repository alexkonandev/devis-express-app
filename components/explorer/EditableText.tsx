"use client";

import React, { useState, useEffect, useRef } from "react";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditableTextProps {
  value: string;
  onSave: (value: string) => void;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
}

export const EditableText = ({
  value,
  onSave,
  className,
  as: Tag = "p",
}: EditableTextProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (localValue.trim() !== "") {
      onSave(localValue);
    } else {
      setLocalValue(value); // Revert if empty
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleBlur();
    if (e.key === "Escape") {
      setLocalValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          "bg-transparent border-b-2 border-indigo-500 outline-none w-full",
          className
        )}
      />
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className={cn(
        "group cursor-pointer relative flex items-center gap-2 hover:bg-zinc-50 rounded px-1 -ml-1 transition-colors",
        className
      )}
    >
      <Tag className="truncate">{localValue}</Tag>
      <Pencil className="w-3 h-3 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};
