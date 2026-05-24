import * as React from "react"

import { cn } from "@/lib/utils"

export function AdminEditorLayout({
  children,
  sidebar,
  leftClassName,
  sidebarClassName,
  stickySidebar = true,
  className,
}: {
  children: React.ReactNode
  sidebar: React.ReactNode
  leftClassName?: string
  sidebarClassName?: string
  stickySidebar?: boolean
  className?: string
}) {
  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-start", className)}>
      <div
        className={cn(
          "bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none p-8",
          leftClassName
        )}
      >
        {children}
      </div>

      <div className={cn(stickySidebar ? "sticky top-8" : "", sidebarClassName)}>{sidebar}</div>
    </div>
  )
}

