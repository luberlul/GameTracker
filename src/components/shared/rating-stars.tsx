import { Star, Sparkles, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  value: number;
  max?: number;
  size?: "xs" | "sm" | "md";
  icon?: "star" | "sparkles";
  activeColor?: string;
  inactiveColor?: string;
}

const sizeMap = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-6 h-6",
};

export function RatingStars({
  value,
  max = 10,
  size = "xs",
  icon = "star",
  activeColor = "text-yellow-400 fill-yellow-400",
  inactiveColor = "text-gray-600",
}: RatingStarsProps) {
  const Icon: LucideIcon = icon === "sparkles" ? Sparkles : Star;
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Icon
          key={i}
          className={cn(sizeMap[size], i < value ? activeColor : inactiveColor)}
        />
      ))}
    </div>
  );
}
