import * as React from "react"

import Link from "next/link"

import { cn } from "@/lib/utils"

export function AdminActiveFilters({
  filters,
  resetHref,
  className,
  title = "Active Filters:",
  resetLabel = "Reset All",
}: {
  filters: Array<{ label: string; value: React.ReactNode }>
  resetHref: string
  className?: string
  title?: string
  resetLabel?: string
}) {
  if (!filters.length) return null

  return (
    <div className={cn("flex items-center gap-2 px-2", className)}>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
        {title}
      </p>
      {filters.map((filter) => (
        <span
          key={filter.label}
          className="px-3 py-1 bg-brand-50 text-brand-600 rounded-lg text-[10px] font-bold uppercase tracking-tight"
        >
          {filter.label}: {filter.value}
        </span>
      ))}
      <Link
        href={resetHref}
        className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline px-2"
      >
        {resetLabel}
      </Link>
    </div>
  )
}

