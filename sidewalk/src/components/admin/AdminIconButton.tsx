import * as React from "react"

import Link from "next/link"

import { cn } from "@/lib/utils"

type Variant = "brand" | "danger" | "neutral"

type Size = "sm" | "md" | "lg"

const base =
  "p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 rounded-xl transition-all"

const sizes: Record<Size, string> = {
  sm: "p-2 rounded-lg",
  md: "",
  lg: "p-4 rounded-2xl",
}

const variants: Record<Variant, string> = {
  brand:
    "hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-100 dark:hover:border-brand-900 hover:shadow-lg hover:shadow-brand-100 dark:hover:shadow-none",
  danger:
    "hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-100 dark:hover:border-rose-900 hover:shadow-lg hover:shadow-rose-100 dark:hover:shadow-none",
  neutral:
    "hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-200 dark:hover:border-slate-600 hover:shadow-lg hover:shadow-slate-100 dark:hover:shadow-none",
}

export function AdminIconButtonLink({
  href,
  title,
  ariaLabel,
  variant = "brand",
  size = "md",
  className,
  target,
  rel,
  children,
}: {
  href: string
  title?: string
  ariaLabel?: string
  variant?: Variant
  size?: Size
  className?: string
  target?: React.HTMLAttributeAnchorTarget
  rel?: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      title={title}
      target={target}
      rel={rel}
      aria-label={ariaLabel ?? title}
      className={cn(base, sizes[size], variants[variant], className)}
    >
      {children}
    </Link>
  )
}

export function AdminIconButton({
  onClick,
  title,
  ariaLabel,
  variant = "neutral",
  size = "md",
  className,
  children,
  type = "button",
  disabled,
}: {
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  title?: string
  ariaLabel?: string
  variant?: Variant
  size?: Size
  className?: string
  children: React.ReactNode
  type?: "button" | "submit"
  disabled?: boolean
}) {
  return (
    <button
      type={type}
      title={title}
      aria-label={ariaLabel ?? title}
      onClick={onClick}
      disabled={disabled}
      className={cn(base, sizes[size], variants[variant], "disabled:opacity-50", className)}
    >
      {children}
    </button>
  )
}
