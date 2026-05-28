'use client'

import React, { useMemo, useState } from 'react'
import { CardContent } from '@/components/ui/card'
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
  { category: 'Developer', percent: 40, note: 'Project developer' },
  { category: 'Tax', percent: 12, note: 'Separate account' },
  { category: 'Profit', percent: 8, note: 'Retained profit' },
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
  const [isEditingTotal, setIsEditingTotal] = useState(false)
  const [draftTotal, setDraftTotal] = useState(String(jobTotal))
  const [currentAllocations, setCurrentAllocations] = useState(allocations)
  const [editingPercent, setEditingPercent] = useState<string | null>(null)
  const [draftPercent, setDraftPercent] = useState('')

  const rows = useMemo(
    () =>
      currentAllocations.map((allocation) => {
        const amount = jobTotal * (allocation.percent / 100)
        return {
          ...allocation,
          amount,
          detail: allocation.getDetail?.(amount),
        }
      }),
    [currentAllocations, jobTotal],
  )

  const ownerAllocation = currentAllocations[0]
  const percentTotal = currentAllocations.reduce((sum, allocation) => sum + allocation.percent, 0)
  const allocatedTotal = rows.reduce((sum, row) => sum + row.amount, 0)
  const isOverAllocated = percentTotal > 100
  const isUnderAllocated = percentTotal < 100

  const savePercent = (category: string) => {
    setCurrentAllocations((prev) =>
      prev.map((allocation) =>
        allocation.category === category
          ? { ...allocation, percent: Math.max(0, Number(draftPercent || 0)) }
          : allocation,
      ),
    )
    setEditingPercent(null)
  }

  return (
    <CardContent className="flex h-full flex-col overflow-hidden p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            Job Breakdown
          </div>
          {isEditingTotal ? (
            <input
              autoFocus
              aria-label="Job total"
              type="number"
              min="0"
              step="100"
              value={draftTotal}
              onChange={(event) => setDraftTotal(event.target.value)}
              onBlur={() => {
                setJobTotal(Number(draftTotal || 0))
                setIsEditingTotal(false)
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  setJobTotal(Number(draftTotal || 0))
                  setIsEditingTotal(false)
                }
                if (event.key === 'Escape') {
                  setDraftTotal(String(jobTotal))
                  setIsEditingTotal(false)
                }
              }}
              className="mt-2 inline-block w-32 border-0 border-b-2 border-slate-900 bg-transparent px-0 pb-1 text-2xl font-black tracking-tighter text-slate-900 outline-none dark:border-white dark:text-white"
            />
          ) : (
            <button
              type="button"
              aria-label="Edit job total"
              onClick={() => {
                setDraftTotal(String(jobTotal))
                setIsEditingTotal(true)
              }}
              className="mt-2 inline-block border-b-2 border-slate-900 pb-1 text-left text-2xl font-black tracking-tighter text-slate-900 transition-colors hover:border-brand-600 hover:text-brand-600 dark:border-white dark:text-white dark:hover:border-brand-300 dark:hover:text-brand-300"
            >
              {formatCurrency(jobTotal)}
            </button>
          )}
        </div>
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
              {editingPercent === row.category ? (
                <input
                  autoFocus
                  aria-label={`${row.category} percentage`}
                  type="number"
                  min="0"
                  step="1"
                  value={draftPercent}
                  onChange={(event) => setDraftPercent(event.target.value)}
                  onBlur={() => savePercent(row.category)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      savePercent(row.category)
                    }
                    if (event.key === 'Escape') {
                      setEditingPercent(null)
                    }
                  }}
                  className="w-11 justify-self-end border-0 border-b border-slate-400 bg-transparent px-0 pb-0.5 text-right text-xs font-black text-slate-500 outline-none dark:border-slate-500 dark:text-slate-400"
                />
              ) : (
                <button
                  type="button"
                  aria-label={`Edit ${row.category} percentage`}
                  onClick={() => {
                    setDraftPercent(String(row.percent))
                    setEditingPercent(row.category)
                  }}
                  className="justify-self-end border-b border-slate-300 pb-0.5 text-right text-xs font-black text-slate-500 transition-colors hover:border-brand-600 hover:text-brand-600 dark:border-slate-600 dark:text-slate-400 dark:hover:border-brand-300 dark:hover:text-brand-300"
                >
                  {row.percent}%
                </button>
              )}
              <div className="text-right text-xs font-black text-slate-800 dark:text-slate-200">
                {formatCurrency(row.amount)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isOverAllocated || isUnderAllocated ? (
        <div
          className={cn(
            'mt-3 rounded-2xl border px-3 py-2 text-[10px] font-black uppercase tracking-widest',
            isOverAllocated
              ? 'border-red-100 bg-red-50 text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300'
              : 'border-amber-100 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300',
          )}
        >
          {isOverAllocated
            ? `Over allocated by ${percentTotal - 100}%`
            : `Under allocated by ${100 - percentTotal}%`}
        </div>
      ) : null}

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
        <SummaryPill
          label="Allocated"
          value={formatCurrency(allocatedTotal)}
          className={
            isOverAllocated
              ? 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300'
              : isUnderAllocated
                ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300'
              : undefined
          }
          valueClassName={
            isOverAllocated
              ? 'text-red-700 dark:text-red-300'
              : isUnderAllocated
                ? 'text-amber-700 dark:text-amber-300'
                : undefined
          }
        />
        <SummaryPill
          label="Owner Split"
          value={formatCurrency((jobTotal * ownerAllocation.percent) / 100 / 2)}
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
  valueClassName,
}: {
  label: string
  value: string
  className?: string
  valueClassName?: string
}) {
  return (
    <div className={cn('rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/30', className)}>
      <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
        {label}
      </div>
      <div className={cn('mt-1 truncate text-sm font-black text-slate-900 dark:text-white', valueClassName)}>
        {value}
      </div>
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
        rows: 3,
        content: <JobBreakdownCalculatorCard />,
      },
    ],
    [],
  )

  useDashboardGridRegistration('job-breakdown-calculator', widgets)
  return null
}
