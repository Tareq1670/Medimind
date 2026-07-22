"use client";

import {
  Pagination as HeroPagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@heroui/react";

interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems?: number;
  perPage?: number;
  onPageChange: (page: number) => void;
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | "...")[] = [1];
  if (current > 3) pages.push("...");
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}

export function Pagination({ page, totalPages, totalItems, perPage, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(page, totalPages);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      {totalItems != null && perPage && (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Showing <span className="font-medium text-slate-700 dark:text-slate-300">
            {(page - 1) * perPage + 1}–{Math.min(page * perPage, totalItems)}
          </span> of{" "}
          <span className="font-medium text-slate-700 dark:text-slate-300">{totalItems}</span>
        </p>
      )}
      <HeroPagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onPress={() => onPageChange(page - 1)}
              isDisabled={page <= 1}
            >
              Previous
            </PaginationPrevious>
          </PaginationItem>
          {pages.map((p, i) =>
            p === "..." ? (
              <PaginationItem key={`ellipsis-${i}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={p}>
                <PaginationLink
                  isActive={p === page}
                  onPress={() => onPageChange(p)}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationNext
              onPress={() => onPageChange(page + 1)}
              isDisabled={page >= totalPages}
            >
              Next
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </HeroPagination>
    </div>
  );
}
