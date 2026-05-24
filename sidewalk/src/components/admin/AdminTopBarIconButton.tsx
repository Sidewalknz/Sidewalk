'use client'

import * as React from 'react'

import Link from 'next/link'

import { cn } from '@/lib/utils'

type Variant = 'brand' | 'danger' | 'neutral'
type Size = 'sm' | 'md'

const base =
  'inline-flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 transition-all shadow-sm active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand-500/20 cursor-pointer'

const sizes: Record<Size, string> = {
  sm: 'w-10 h-10',
  md: 'w-11 h-11',
}

const variants: Record<Variant, string> = {
  brand: 'hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-200 dark:hover:border-brand-900',
  danger: 'hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-900',
  neutral: 'hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600',
}

export function AdminTopBarIconButtonLink({
  href,
  title,
  ariaLabel,
  variant = 'brand',
  size = 'md',
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

export const AdminTopBarIconButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    title?: string
    ariaLabel?: string
    variant?: Variant
    size?: Size
  }
>(function AdminTopBarIconButton(
  { title, ariaLabel, variant = 'neutral', size = 'md', className, children, type = 'button', disabled, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      title={title}
      aria-label={ariaLabel ?? title}
      disabled={disabled}
      {...props}
      className={cn(base, sizes[size], variants[variant], 'disabled:opacity-50 disabled:cursor-not-allowed', className)}
    >
      {children}
    </button>
  )
})
