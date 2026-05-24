import * as React from "react"

import { cn } from "@/lib/utils"

export function AdminEmptyStateContent({
  title = "No results found",
  description = "Try adjusting your search or filters.",
  className,
}: {
  title?: string
  description?: string
  className?: string
}) {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{title}</p>
      <p className="text-xs font-medium text-slate-400 dark:text-slate-500">{description}</p>
    </div>
  )
}

export function AdminTableEmptyState({
  colSpan,
  title = "No results found",
  description = "Try adjusting your search or filters.",
  className,
}: {
  colSpan: number
  title?: string
  description?: string
  className?: string
}) {
  return (
    <tr>
      <td colSpan={colSpan} className={cn("px-8 py-20 text-center", className)}>
        <AdminEmptyStateContent title={title} description={description} />
      </td>
    </tr>
  )
}
