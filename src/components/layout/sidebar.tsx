"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Library,
  BarChart3,
  PlusCircle,
  User,
  Trophy,
  Gamepad2,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MenuItem {
  href: string;
  label: string;
  icon: LucideIcon;
  match?: (path: string) => boolean;
}

const menuItems: MenuItem[] = [
  { href: "/", label: "Dashboard", icon: Home, match: (p) => p === "/" },
  {
    href: "/library",
    label: "Biblioteca",
    icon: Library,
    match: (p) => p.startsWith("/library"),
  },
  { href: "/stats", label: "Estatísticas", icon: BarChart3 },
  { href: "/tierlist", label: "Tier List", icon: Trophy },
  { href: "/add", label: "Adicionar Jogo", icon: PlusCircle },
  { href: "/profile", label: "Perfil", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col fixed left-0 top-0 z-40">
      <div className="p-6 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-neon-cyan rounded-lg flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
            <Gamepad2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-neon-cyan bg-clip-text text-transparent">
              GameTrack
            </h1>
            <p className="text-xs text-muted-foreground">Premium Gaming</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.match
            ? item.match(pathname)
            : pathname === item.href;

          return (
            <Link key={item.href} href={item.href} className="block">
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-primary/20"
                    : "text-sidebar-foreground hover:bg-sidebar-accent",
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <Link
          href="/profile"
          className="flex items-center gap-3 p-3 rounded-lg bg-sidebar-accent hover:bg-sidebar-accent/70 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-neon-pink flex items-center justify-center text-white font-bold">
            JP
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">João Player</p>
            <p className="text-xs text-muted-foreground">Pro Gamer</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
