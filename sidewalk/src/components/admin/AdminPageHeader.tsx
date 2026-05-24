'use client'

import * as React from "react"

import { usePathname } from "next/navigation"

import { ArrowLeft } from "lucide-react"

import { cn } from "@/lib/utils"
import { AdminTopBarIconButtonLink } from "@/components/admin/AdminTopBarIconButton"

function getParentAdminPath(pathname: string | null) {
  if (!pathname) return "/admin"
  if (!pathname.startsWith("/admin")) return "/admin"

  const parts = pathname.split("?")[0]?.split("#")[0]?.split("/").filter(Boolean) ?? []
  if (parts.length <= 1) return "/admin"

  const parent = `/${parts.slice(0, -1).join("/")}`
  return parent.startsWith("/admin") ? parent : "/admin"
}

export function AdminPageHeader({
  title,
  subtitle,
  pretitle,
  center,
  children,
  backHref,
  backTitle = "Back",
  showBackButton = true,
  className,
  titleClassName,
  subtitleClassName,
  pretitleClassName,
  centerClassName,
  actionsClassName,
  showAccentDot = true,
}: {
  title: React.ReactNode
  subtitle?: React.ReactNode
  pretitle?: React.ReactNode
  center?: React.ReactNode
  children?: React.ReactNode
  backHref?: string
  backTitle?: string
  showBackButton?: boolean
  className?: string
  titleClassName?: string
  subtitleClassName?: string
  pretitleClassName?: string
  centerClassName?: string
  actionsClassName?: string
  showAccentDot?: boolean
}) {
  const pathname = usePathname()
  const resolvedBackHref = backHref ?? getParentAdminPath(pathname)
  const hasActions = Boolean(children)

  return (
    <div
      className={cn(
        "bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200/60 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none",
        className
      )}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {showBackButton ? (
            <AdminTopBarIconButtonLink href={resolvedBackHref} title={backTitle} variant="neutral">
              <ArrowLeft className="w-4 h-4" />
            </AdminTopBarIconButtonLink>
          ) : null}
          {pretitle ? <div className={cn(pretitleClassName)}>{pretitle}</div> : null}
          <div>
            <h2
              className={cn(
                "text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase",
                titleClassName
              )}
            >
              {title}
              {showAccentDot ? <span className="text-brand-600">.</span> : null}
            </h2>
            {subtitle ? (
              <p
                className={cn(
                  "text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1",
                  subtitleClassName
                )}
              >
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>

        {center ? (
          <div
            className={cn(
              hasActions ? "flex-1 max-w-md mx-0 md:mx-6 w-full" : "w-full md:w-auto max-w-md md:ml-auto",
              centerClassName
            )}
          >
            {center}
          </div>
        ) : null}

        {children ? (
          <div className={cn("flex items-center gap-2 justify-end", actionsClassName)}>
            {children}
          </div>
        ) : null}
      </div>
    </div>
  )
}
