// @/features/quotes/quotes-view.tsx
"use client";

import React, { useTransition } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { QuotesLayout } from "./components/quotes-layout";
import { QuoteExplorer } from "./components/quote-explorer";
import { QuoteInspector } from "./components/quote-inspector";
import { QuoteIntelligence } from "./components/quote-intelligence";
import { QuoteListItem } from "@/types/quote";

interface QuotesListViewProps {
  initialData: {
    items: QuoteListItem[];
    totalCount: number;
    totalPages: number;
  };
}

export default function QuotesView({ initialData }: QuotesListViewProps) {
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const activeId = searchParams.get("id");
  const selectedQuote = initialData.items.find((q) => q.id === activeId);

  const handleSelectQuote = (id: string) => {
    if (id === activeId) return;
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.set("id", id);
      replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <QuotesLayout
      explorer={
        <QuoteExplorer
          items={initialData.items}
          activeId={activeId}
          onSelect={handleSelectQuote}
        />
      }
      inspector={
        <div className="h-full overflow-hidden bg-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId || "empty"}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: isPending ? 0.5 : 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              <QuoteInspector quote={selectedQuote} />
            </motion.div>
          </AnimatePresence>
        </div>
      }
      intelligence={
        <div className="h-full overflow-hidden border-l border-slate-100">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId || "empty_intel"}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: isPending ? 0.5 : 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <QuoteIntelligence quote={selectedQuote} />
            </motion.div>
          </AnimatePresence>
        </div>
      }
    />
  );
}
