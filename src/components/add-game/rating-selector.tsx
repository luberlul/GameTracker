"use client";

import { Star, Sparkles, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingSelectorProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
  icon?: "star" | "sparkles";
  activeColor?: string;
  hoverColor?: string;
}

export function RatingSelector({
  label,
  value,
  onChange,
  max = 10,
  icon = "star",
  activeColor = "text-yellow-400 fill-yellow-400",
  hoverColor = "hover:text-yellow-400/50",
}: RatingSelectorProps) {
  const Icon: LucideIcon = icon === "sparkles" ? Sparkles : Star;
  return (
    <div>
      <label className="block mb-2 text-sm font-medium">{label}</label>
      <div className="flex gap-1 flex-wrap">
        {Array.from({ length: max }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i + 1)}
            className="transition-all hover:scale-110"
          >
            <Icon
              className={cn(
                "w-6 h-6",
                i < value ? activeColor : cn("text-gray-600", hoverColor),
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
