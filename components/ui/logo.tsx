// src/components/ui/logo.tsx
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "full" | "icon"; // "full" par défaut, "icon" pour le "DE" uniquement
}

export const Logo = ({ className, variant = "full" }: LogoProps) => {
  return (
    <div className={cn("relative transition-all", className)}>
      <Image
        // Tu devras avoir deux fichiers dans /public : logo-full.svg et logo-icon.svg
        src={variant === "full" ? "/logo.svg" : "/logo-icon.svg"}
        alt="DevisExpress"
        fill
        className="object-contain"
        priority
      />
    </div>
  );
};
