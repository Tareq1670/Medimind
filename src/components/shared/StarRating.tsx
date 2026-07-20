"use client";

import { Star } from "@/lib/icon-map";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export function StarRating({
  rating,
  max = 5,
  size = "sm",
  showValue = false,
  interactive = false,
  onChange,
}: StarRatingProps) {
  const sizeMap = { sm: "w-3.5 h-3.5", md: "w-4 h-4", lg: "w-5 h-5" };

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => {
        const value = i + 1;
        const filled = value <= Math.floor(rating);
        const half = !filled && value - 0.5 <= rating;
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(value)}
            className={cn(interactive && "cursor-pointer hover:scale-110 transition-transform")}
          >
            <Star
              className={cn(
                sizeMap[size],
                filled
                  ? "fill-amber-400 text-amber-400"
                  : half
                  ? "fill-amber-400/50 text-amber-400/50"
                  : "fill-slate-200 dark:fill-slate-700 text-slate-200 dark:text-slate-700"
              )}
            />
          </button>
        );
      })}
      {showValue && (
        <span className="ml-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
