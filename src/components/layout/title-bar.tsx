"use client";

import { useEffect, useState } from "react";
import { Minus, Square, Copy, X, Gamepad2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function TitleBar() {
  const [mounted, setMounted] = useState(false);
  const [isElectron, setIsElectron] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    setMounted(true);
    const electron = typeof window !== "undefined" ? window.electron : undefined;
    if (!electron) return;

    setIsElectron(true);
    document.body.classList.add("is-electron");
    electron.isMaximized().then(setIsMaximized);
    const off = electron.onMaximizeChange(setIsMaximized);
    return () => {
      off();
      document.body.classList.remove("is-electron");
    };
  }, []);

  // Render nothing on SSR / outside Electron — this keeps a normal browser experience clean
  if (!mounted || !isElectron) return null;

  const electron = window.electron!;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] h-9 flex items-center justify-between bg-sidebar/95 backdrop-blur-xl border-b border-sidebar-border select-none"
      style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
    >
      <div className="flex items-center gap-2 pl-3 pointer-events-none">
        <div className="w-5 h-5 bg-gradient-to-br from-primary to-neon-cyan rounded-md flex items-center justify-center shadow-md shadow-primary/30">
          <Gamepad2 className="w-3 h-3 text-white" />
        </div>
        <span className="text-xs font-semibold bg-gradient-to-r from-primary to-neon-cyan bg-clip-text text-transparent">
          GameTrack
        </span>
      </div>

      <div
        className="flex h-full"
        style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
      >
        <TitleBarButton onClick={() => electron.minimize()} ariaLabel="Minimizar">
          <Minus className="w-4 h-4" />
        </TitleBarButton>
        <TitleBarButton
          onClick={() => electron.toggleMaximize()}
          ariaLabel={isMaximized ? "Restaurar" : "Maximizar"}
        >
          {isMaximized ? (
            <Copy className="w-3.5 h-3.5 -scale-x-100" />
          ) : (
            <Square className="w-3 h-3" />
          )}
        </TitleBarButton>
        <TitleBarButton
          onClick={() => electron.close()}
          ariaLabel="Fechar"
          variant="danger"
        >
          <X className="w-4 h-4" />
        </TitleBarButton>
      </div>
    </div>
  );
}

interface TitleBarButtonProps {
  onClick: () => void;
  ariaLabel: string;
  variant?: "default" | "danger";
  children: React.ReactNode;
}

function TitleBarButton({
  onClick,
  ariaLabel,
  variant = "default",
  children,
}: TitleBarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        "h-full w-12 flex items-center justify-center text-muted-foreground transition-colors",
        variant === "danger"
          ? "hover:bg-red-500 hover:text-white"
          : "hover:bg-sidebar-accent hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
