// app/(info)/layout.tsx
import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

export default function InfoLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[oklch(1_0_0)] text-[oklch(0.12_0.02_252)] font-sans antialiased">
      {/* Navbar centrée pour une lecture focalisée */}
      <nav className="sticky top-0 z-50 border-b border-[oklch(0.92_0.01_250)] bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-3xl px-6 h-16 flex items-center justify-between">
          <Button asChild variant="ghost" size="sm" className="gap-2 -ml-4">
            <Link href="/">
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Link>
          </Button>

          {/* On utilise la variante icône pour rester discret et pro */}
          <Logo variant="icon" className="h-7 w-7" />
        </div>
      </nav>

      <article className="mx-auto max-w-3xl px-6 py-16">{children}</article>

      <footer className="mx-auto max-w-3xl px-6 py-12 border-t border-[oklch(0.92_0.01_250)] text-center text-[10px] text-muted-foreground uppercase tracking-widest">
        © 2026 DevisExpress — Support & Légal
      </footer>
    </div>
  );
}
