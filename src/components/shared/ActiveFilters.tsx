"use client";

import { X } from "@/lib/icon-map";

interface FilterChip {
  key: string;
  label: string;
  value: string;
  onRemove: () => void;
}

interface ActiveFiltersProps {
  chips: FilterChip[];
  onClearAll: () => void;
  totalCount: number;
}

function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();
}

export function ActiveFilters({ chips, onClearAll, totalCount }: ActiveFiltersProps) {
  if (totalCount === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
        Active:
      </span>
      {chips.map((chip) => (
        <span
          key={`${chip.key}-${chip.value}`}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary dark:bg-primary/20"
        >
          <span className="text-slate-500 dark:text-slate-400">{formatLabel(chip.key)}:</span>
          <span>{chip.value}</span>
          <button
            onClick={chip.onRemove}
            className="ml-0.5 p-0.5 rounded-full hover:bg-primary/20 transition-colors"
            aria-label={`Remove ${chip.label}`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      {totalCount > 1 && (
        <button
          onClick={onClearAll}
          className="text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline underline-offset-2 transition-colors"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
