import * as React from "react"

import { cn } from "@/lib/utils"

export function AdminEditorSidebarCard({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "rounded-[2.5rem] bg-slate-950 text-white border border-slate-900 shadow-2xl shadow-slate-300/40 dark:shadow-none p-8",
        className
      )}
    >
      {children}
    </div>
  )
}

