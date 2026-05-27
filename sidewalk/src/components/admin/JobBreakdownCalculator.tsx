'use client'

import React, { useMemo, useState } from 'react'
import { Calculator } from 'lucide-react'
import { CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  useDashboardGridRegistration,
  type DashboardWidgetDefinition,
} from '@/components/admin/DashboardGrid'
import { cn } from '@/lib/utils'

type Allocation = {
  category: string
  percent: number
  note: string
  getDetail?: (amount: number) => string
}

const allocations: Allocation[] = [
  {
    category: 'Owner Compensation',
    percent: 30,
    note: 'Split 50:50',
    getDetail: (amount) => `${formatCurrency(amount / 2)} each`,
  },
  { category: 'Admin', percent: 10, note: 'Handled admin' },
  { category: 'Designer', percent: 25, note: 'Project designer' },
  { category: 'Tax', percent: 12, note: 'Separate account' },
  { category: 'Profit', percent: 8, note: 'Retained profit' },
  { category: 'Operating Expenses', percent: 15, note: 'Remaining balance' },
]

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-NZ', {
    style: 'currency',
    currency: 'NZD',
    maximumFractionDigits: Number(value) % 1 === 0 ? 0 : 2,
  }).format(Number(value || 0))
}

function JobBreakdownCalculatorCard() {
  const [jobTotal, setJobTotal] = useState(5000)

  const rows = useMemo(
    () =>
      allocations.map((allocation) => {
        const amount = jobTotal * (allocation.percent / 100)
        return {
          ...allocation,
          amount,
          detail: allocation.getDetail?.(amount),
        }
      }),
    [jobTotal],
  )

  return (
    <CardContent className="flex h-full flex-col overflow-hidden p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-brand-600">
            <Calculator className="h-4 w-4" />
            Job Breakdown
          </div>
          <h3 className="mt-2 text-2xl font-black tracking-tighter text-slate-900 dark:text-white">
            {formatCurrency(jobTotal)}
          </h3>
        </div>
        <label className="w-32 shrink-0">
          <span className="sr-only">Job total</span>
          <Input
            type="number"
            min="0"
            step="100"
            value={jobTotal}
            onChange={(event) => setJobTotal(Number(event.target.value || 0))}
            className="h-10 rounded-xl text-right text-sm font-black"
          />
        </label>
      </div>

      <div className="mt-4 min-h-0 flex-1 overflow-auto pr-1">
        <div className="grid grid-cols-[minmax(112px,1fr)_44px_74px] gap-x-3 border-b border-slate-100 pb-2 text-[9px] font-black uppercase tracking-widest text-slate-400 dark:border-slate-800 dark:text-slate-500">
          <div>Category</div>
          <div className="text-right">%</div>
          <div className="text-right">Amount</div>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {rows.map((row) => (
            <div
              key={row.category}
              className="grid grid-cols-[minmax(112px,1fr)_44px_74px] gap-x-3 py-3"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-black tracking-tight text-slate-900 dark:text-white">
                  {row.category}
                </div>
                <div className="mt-1 truncate text-[10px] font-bold text-slate-400 dark:text-slate-500">
                  {row.detail ? `${row.note} - ${row.detail}` : row.note}
                </div>
              </div>
              <div className="text-right text-xs font-black text-slate-500 dark:text-slate-400">
                {row.percent}%
              </div>
              <div className="text-right text-xs font-black text-slate-800 dark:text-slate-200">
                {formatCurrency(row.amount)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
        <SummaryPill label="Allocated" value={formatCurrency(jobTotal)} />
        <SummaryPill
          label="Owner Split"
          value={formatCurrency((jobTotal * allocations[0].percent) / 100 / 2)}
          className="bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-300"
        />
      </div>
    </CardContent>
  )
}

function SummaryPill({
  label,
  value,
  className,
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <div className={cn('rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/30', className)}>
      <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
        {label}
      </div>
      <div className="mt-1 truncate text-sm font-black text-slate-900 dark:text-white">{value}</div>
    </div>
  )
}

export function JobBreakdownCalculator() {
  const widgets = useMemo<DashboardWidgetDefinition[]>(
    () => [
      {
        id: 'job-breakdown-calculator',
        title: 'Job Breakdown',
        span: 1,
        rows: 2,
        content: <JobBreakdownCalculatorCard />,
      },
    ],
    [],
  )

  useDashboardGridRegistration('job-breakdown-calculator', widgets)
  return null
}
