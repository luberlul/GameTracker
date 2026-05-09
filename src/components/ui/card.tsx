"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  hover?: boolean;
  glass?: boolean;
}

export function Card({
  children,
  className,
  hover = false,
  glass = false,
  ...rest
}: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ duration: 0.2 }}
      className={cn(
        "rounded-xl p-6",
        glass
          ? "bg-card/40 backdrop-blur-xl border border-border/50"
          : "bg-card border border-border",
        hover && "cursor-pointer shadow-lg hover:shadow-primary/10",
        className,
      )}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
