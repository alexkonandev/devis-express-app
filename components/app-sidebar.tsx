"use client";

import { ElementType } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
/**
 * Utilisation des imports PascalCase avec suffixe Icon
 * pour éliminer les warnings de dépréciation.
 */
import {
  SquaresFourIcon,
  FileTextIcon,
  UsersThreeIcon,
  PackageIcon,
  PlusIcon,
  CreditCardIcon,
  GearSixIcon, // gear devient gear-six-icon
  SignOutIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MAIN_NAV = [
  { label: "Dashboard", href: "/dashboard", icon: SquaresFourIcon },
  { label: "Devis", href: "/quotes", icon: FileTextIcon },
  { label: "Clients", href: "/clients", icon: UsersThreeIcon },
  { label: "Catalogue", href: "/catalog", icon: PackageIcon },
] as const;

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <aside className="h-full w-14 bg-white flex flex-col items-center shrink-0 border-r border-slate-200 z-50 overflow-hidden">
  
      {/* PRIMARY NAVIGATION */}
      <nav className="flex flex-col w-full flex-1 mt-2">
        {MAIN_NAV.map((item) => (
          <NavIcon
            key={item.href}
            {...item}
            isActive={pathname.startsWith(item.href)}
          />
        ))}

        {/* QUICK ACTION DIVIDER */}
        <div className="mx-3 my-4 border-t border-slate-100" />

        <NavIcon
          label="Nouveau Devis"
          href="/quotes/editor"
          icon={PlusIcon}
          isActive={pathname === "/quotes/editor"}
          isAction
        />
      </nav>

      {/* SYSTEM NAVIGATION (BOTTOM) */}
      <div className="flex flex-col w-full border-t border-slate-100 bg-slate-50/30">
        <NavIcon
          label="Facturation"
          href="/billing"
          icon={CreditCardIcon}
          isActive={pathname === "/billing"}
        />
        <NavIcon
          label="Configuration"
          href="/settings"
          icon={GearSixIcon}
          isActive={pathname === "/settings"}
        />

        {/* AUTH UNIT */}
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleSignOut}
                className="w-full h-14 flex items-center justify-center hover:bg-rose-50 group border-t border-slate-100 transition-colors"
              >
                <Avatar className="w-6 h-6 rounded-none border border-slate-300 grayscale group-hover:grayscale-0 transition-all">
                  <AvatarImage
                    src={user?.imageUrl}
                    className="rounded-none object-cover"
                  />
                  <AvatarFallback className="bg-slate-950 text-[8px] text-white font-black rounded-none">
                    {user?.firstName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="bg-slate-950 text-white border-none text-[10px] font-black uppercase tracking-[0.2em] rounded-none ml-2"
            >
              <div className="flex flex-col gap-1">
                <span>{user?.fullName}</span>
                <span className="text-rose-500 flex items-center gap-1 opacity-80 uppercase">
                  <SignOutIcon size={12} weight="bold" /> Logout
                </span>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </aside>
  );
}

interface NavIconProps {
  label: string;
  href: string;
  icon: ElementType;
  isActive: boolean;
  isAction?: boolean;
}

function NavIcon({
  label,
  href,
  icon: Icon,
  isActive,
  isAction = false,
}: NavIconProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={href}
            className={cn(
              "w-full h-14 flex items-center justify-center transition-none relative group",
              isAction
                ? "text-indigo-600 hover:bg-indigo-50"
                : isActive
                ? "bg-white text-slate-950"
                : "text-slate-400 hover:text-slate-950 hover:bg-slate-50"
            )}
          >
            {/* INDICATEUR DE FOCUS ACTIF (Blueprint Style) */}
            {isActive && (
              <div className="absolute left-0 top-0 w-[2px] h-full bg-indigo-600" />
            )}

            <Icon
              size={20}
              weight={isActive || isAction ? "bold" : "regular"}
            />
          </Link>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          className="bg-slate-950 text-white border-none font-black text-[10px] uppercase tracking-[0.2em] rounded-none ml-2"
        >
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
