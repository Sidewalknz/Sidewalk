import * as React from "react"

import Link from "next/link"

import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

export function AdminListFooterBar({
  label = "Items per page",
  limitOptions = [10, 20, 50],
  currentLimit,
  getLimitHref,
  currentPage = 1,
  totalPages = 1,
  getPageHref,
  showLimitSelector,
  showPagination,
  className,
}: {
  label?: React.ReactNode
  limitOptions?: number[]
  currentLimit?: number
  getLimitHref?: (limit: number) => string
  currentPage?: number
  totalPages?: number
  getPageHref?: (page: number) => string
  showLimitSelector?: boolean
  showPagination?: boolean
  className?: string
}) {
  const resolvedShowLimitSelector =
    showLimitSelector ??
    Boolean(getLimitHref && typeof currentLimit === "number" && (limitOptions?.length ?? 0) > 0)

  const resolvedShowPagination =
    showPagination ??
    Boolean(typeof currentPage === "number" && typeof totalPages === "number")

  const hasPrev = resolvedShowPagination ? currentPage > 1 : false
  const hasNext = resolvedShowPagination ? currentPage < totalPages : false

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row items-center justify-between gap-6 px-4 py-4 bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800",
        className
      )}
    >
      <div className="flex items-center gap-4">
        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
          {label}
        </p>

        {resolvedShowLimitSelector && getLimitHref ? (
          <div className="flex gap-2 items-center">
            {limitOptions.map((limit) => (
              <Link
                key={limit}
                href={getLimitHref(limit)}
                className={cn(
                  "w-7 h-7 flex items-center justify-center rounded-lg text-[10px] font-black transition-all",
                  currentLimit === limit
                    ? "bg-brand-600 text-white shadow-lg shadow-brand-500/25"
                    : "bg-white dark:bg-slate-800 text-slate-400 hover:text-brand-600 border border-slate-100 dark:border-slate-700"
                )}
              >
                {limit}
              </Link>
            ))}
          </div>
        ) : null}
      </div>

      {resolvedShowPagination ? (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 mr-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Page</span>
            <div className="w-9 h-9 flex items-center justify-center rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl text-[10px] font-black">
              {currentPage}
            </div>
          </div>

          <div className="flex gap-2">
            {hasPrev && getPageHref ? (
              <Link
                href={getPageHref(currentPage - 1)}
                aria-label="Previous page"
                title="Previous"
                className="h-11 w-11 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-brand-500 hover:text-brand-600 shadow-sm active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </Link>
            ) : (
              <span
                aria-label="Previous page"
                title="Previous"
                className="h-11 w-11 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center border bg-slate-50 dark:bg-slate-800/50 text-slate-300 dark:text-slate-700 border-slate-100 dark:border-slate-800 cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </span>
            )}

            {hasNext && getPageHref ? (
              <Link
                href={getPageHref(currentPage + 1)}
                aria-label="Next page"
                title="Next"
                className="h-11 w-11 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-brand-500 hover:text-brand-600 shadow-sm active:scale-95"
              >
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <span
                aria-label="Next page"
                title="Next"
                className="h-11 w-11 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center border bg-slate-50 dark:bg-slate-800/50 text-slate-300 dark:text-slate-700 border-slate-100 dark:border-slate-800 cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </span>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
