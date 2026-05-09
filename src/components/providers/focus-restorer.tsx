"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * In Electron, navigating between Next.js pages can leave the BrowserWindow
 * in a state where the DOM has a focused element but the OS isn't routing
 * keyboard/mouse events to the renderer. The classic workaround is to click
 * outside the window and back; this component does that programmatically by
 * asking the main process to call BrowserWindow.focus() on every route change.
 *
 * Also resets any stuck body styles (overflow lock from a Dialog that
 * unmounted mid-animation, etc.) on each navigation.
 */
export function FocusRestorer() {
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = "";
    if (typeof window === "undefined") return;
    window.electron?.focus();
  }, [pathname]);

  return null;
}
