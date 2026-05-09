"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
  size?: "md" | "lg" | "xl";
}

const sizeMap = {
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export function Dialog({
  open,
  onClose,
  children,
  title,
  description,
  className,
  size = "lg",
}: DialogProps) {
  // Stable ref to onClose so the keydown effect doesn't re-fire on every
  // parent render (where onClose is typically a fresh arrow fn).
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Lock body scroll while open. Always reset to "" — never to a captured
  // value — so re-renders, nested dialogs, or unmount-mid-animation can't
  // leave overflow stuck on "hidden" (which kills clicks/typing in Electron).
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Escape key. Use the ref so we don't depend on onClose's identity.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Hard safety net: if this Dialog unmounts (e.g. user navigates away while
  // the AnimatePresence exit animation is mid-flight), force-clear any state
  // we may have set on document.body regardless of the latest `open` value.
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center p-4 sm:p-8 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "relative w-full mt-12 sm:mt-20 bg-card border border-border rounded-2xl shadow-2xl shadow-primary/10",
              sizeMap[size],
              className,
            )}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>
            {(title || description) && (
              <div className="p-6 pb-4 border-b border-border">
                {title && <h2 className="text-2xl font-bold">{title}</h2>}
                {description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {description}
                  </p>
                )}
              </div>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
