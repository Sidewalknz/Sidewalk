import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] transition-colors',
  {
    variants: {
      variant: {
        default: 'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300',
        secondary:
          'border-slate-900/10 bg-slate-900/5 text-slate-900 dark:border-slate-200/10 dark:bg-slate-200/10 dark:text-white',
        accent:
          'border-brand-600/30 bg-brand-50 text-brand-700 dark:border-brand-500/40 dark:bg-brand-500/10 dark:text-brand-300',
        destructive:
          'border-rose-500/30 bg-rose-50 text-rose-600 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200',
        success:
          'border-emerald-500/30 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200',
        outline:
          'border-slate-300 text-slate-500 dark:border-slate-700 dark:text-slate-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

Badge.displayName = 'Badge'
