"use client";

import { ElementType } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Users,
  Package,
  Settings,
  PlusSquare,
  FileText,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MAIN_NAV = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Quotes", href: "/quotes", icon: FileText },
  { label: "Clients", href: "/clients", icon: Users },
  { label: "Catalog", href: "/catalog", icon: Package },
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
    <aside className="h-full w-[60px] bg-white flex flex-col items-center py-4 gap-6 shrink-0 border-r border-zinc-200">
      <nav className="flex flex-col gap-2 w-full px-2">
        {MAIN_NAV.map((item) => (
          <NavIcon
            key={item.href}
            {...item}
            isActive={pathname.startsWith(item.href)}
          />
        ))}
      </nav>

      <div className="w-full px-2 mt-auto pb-4 border-b border-zinc-100">
        <NavIcon
          label="New Quote"
          href="/quotes/editor"
          icon={PlusSquare}
          isActive={pathname === "/quotes/editor"}
          isAction
        />
      </div>

      <div className="flex flex-col gap-3 items-center w-full px-2">
        <NavIcon
          label="Billing"
          href="/billing"
          icon={CreditCard}
          isActive={pathname === "/billing"}
        />
        <NavIcon
          label="Settings"
          href="/settings"
          icon={Settings}
          isActive={pathname === "/settings"}
        />

        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleSignOut}
                className="w-8 h-8 rounded-full ring-2 ring-offset-2 ring-transparent hover:ring-zinc-100 transition-all mt-1"
              >
                <Avatar className="w-8 h-8 border border-zinc-200">
                  <AvatarImage src={user?.imageUrl} />
                  <AvatarFallback className="bg-zinc-900 text-[10px] text-white font-bold">
                    {user?.firstName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="bg-zinc-900 text-white border-none text-xs font-bold"
            >
              <p>{user?.fullName}</p>
              <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-tighter">
                Sign out
              </p>
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
  icon: ElementType; // Remplacement de any
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
              "w-full h-10 flex items-center justify-center rounded-lg transition-all duration-200 group relative",
              isAction
                ? "bg-zinc-900 text-white hover:bg-zinc-800 shadow-md"
                : isActive
                ? "bg-zinc-100 text-zinc-900"
                : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50"
            )}
          >
            <Icon
              className="w-5 h-5"
              strokeWidth={isActive || isAction ? 2.5 : 2}
            />
            {isActive && !isAction && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-zinc-900 rounded-r-full" />
            )}
          </Link>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          className="bg-zinc-900 text-white border-none font-bold text-[11px] uppercase tracking-wider"
        >
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
