import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function AdminCard({
  className,
  ...props
}: React.ComponentProps<typeof Card>) {
  return (
    <Card
      className={cn(
        "border-slate-200/60 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none rounded-3xl overflow-hidden bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm border-none",
        className
      )}
      {...props}
    />
  )
}

export function AdminCardContent({
  className,
  ...props
}: React.ComponentProps<typeof CardContent>) {
  return <CardContent className={cn("p-0", className)} {...props} />
}

