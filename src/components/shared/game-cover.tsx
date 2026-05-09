"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useCachedImage } from "@/lib/image-cache";

interface GameCoverProps {
  title: string;
  coverColor: string;
  /** When provided and loadable, replaces the gradient/letter placeholder. */
  coverImage?: string | null;
  className?: string;
  letterSize?: string;
  children?: ReactNode;
}

export function GameCover({
  title,
  coverColor,
  coverImage,
  className,
  letterSize = "text-7xl",
  children,
}: GameCoverProps) {
  const status = useCachedImage(coverImage ?? null);
  const showImage = coverImage && status === "loaded";

  return (
    <div
      className={cn("relative overflow-hidden rounded-xl shadow-lg", className)}
      style={{
        background: `linear-gradient(135deg, ${coverColor}, ${coverColor}dd)`,
      }}
    >
      {showImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={coverImage}
          alt=""
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      {!showImage && (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center font-bold text-white/10",
            letterSize,
          )}
        >
          {title.charAt(0)}
        </div>
      )}
      {coverImage && status === "loading" && (
        <div className="absolute inset-0 bg-black/20 animate-pulse" />
      )}
      {children}
    </div>
  );
}
