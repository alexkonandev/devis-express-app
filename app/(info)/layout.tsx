import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

export default function InfoLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-slate-950 font-sans antialiased selection:bg-indigo-100">
      {/* NAVBAR : Structure Blueprint sans flou (Backdrop-blur-none pour la netteté) */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-6 h-14 flex items-center justify-between">
          <Button
            asChild
            variant="ghost"
            className="h-full rounded-none px-4 hover:bg-slate-50 gap-3 group border-r border-slate-100"
          >
            <Link href="/">
              <ArrowLeft className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                Retour_Index
              </span>
            </Link>
          </Button>

          <div className="flex items-center gap-4">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest hidden md:block">
              Doc_Ref: INF-2026
            </span>
            <Logo variant="icon" className="h-5 w-5 grayscale " />
          </div>
        </div>
      </nav>

      {/* ARTICLE : Focus Mode avec typographie d'autorité */}
      <main className="mx-auto max-w-4xl px-6 py-20">
        
        <article
          className="prose prose-slate prose-sm max-w-none 
          prose-headings:text-slate-950 prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter
          prose-p:text-[13px] prose-p:leading-relaxed prose-p:text-slate-600
          prose-strong:font-bold prose-strong:text-slate-950
          prose-ul:list-square"
        >
          {children}
        </article>
      </main>

      {/* FOOTER : Tag Industriel */}
      <footer className="mx-auto max-w-4xl px-6 py-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-950">
            Devis_Express_Studio
          </span>
          <span className="text-[9px] font-mono text-slate-400 uppercase">
            Infrastructure de facturation // CI_ABJ_2026
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="h-8 w-[1px] bg-slate-100 hidden md:block" />
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 border border-slate-200">
            <div className="w-1 h-1 bg-emerald-500 rounded-none animate-pulse" />
            <span className="text-[9px] font-black font-mono text-slate-600 uppercase">
              Status: Verified
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
