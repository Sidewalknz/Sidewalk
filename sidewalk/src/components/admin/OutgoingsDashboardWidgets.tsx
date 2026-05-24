'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { CardContent } from '@/components/ui/card'
import {
  useDashboardGridRegistration,
  type DashboardWidgetDefinition,
} from '@/components/admin/DashboardGrid'
import { getOutgoingsDashboardSummary } from '@/actions/outgoings'

type Summary = Awaited<ReturnType<typeof getOutgoingsDashboardSummary>>

function formatDate(raw?: string | null) {
  if (!raw) return '—'
  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('en-NZ', { day: '2-digit', month: 'short' }).format(date)
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-NZ', {
    style: 'currency',
    currency: 'NZD',
    maximumFractionDigits: Number(value) % 1 === 0 ? 0 : 2,
  }).format(Number(value || 0))
}

function StatWidget({
  title,
  value,
  subtitle,
}: {
  title: string
  value: string
  subtitle: string
}) {
  return (
    <CardContent className="p-6">
      <div className="space-y-0">
        <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">
          {title}
        </h3>
        <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{value}</div>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-bold pt-3">{subtitle}</p>
      </div>
    </CardContent>
  )
}

function LoadingCard({ title }: { title: string }) {
  return (
    <CardContent className="p-6 h-full flex flex-col items-center justify-center">
      <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
        {title}
      </div>
      <div className="text-[10px] font-black uppercase tracking-widest text-slate-300 dark:text-slate-600 mt-2">
        Loading...
      </div>
    </CardContent>
  )
}

function UpcomingOutgoingsCard({ summary }: { summary: Summary | null }) {
  const upcoming = summary?.upcoming || []

  return (
    <CardContent className="p-6 h-full flex flex-col">
      <div>
        <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
          Upcoming Outgoings
        </h3>
      </div>

      <div className="mt-5 space-y-2 overflow-auto pr-1">
        {upcoming.length ? (
          upcoming.map((item) => (
            <a
              key={item.id}
              href={`/admin/outgoings/${item.id}`}
              className="block p-3 rounded-2xl bg-slate-50/60 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-black text-slate-900 dark:text-white tracking-tight truncate">
                    {item.name}
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-1">
                    {formatDate(item.nextDueDate)} · {item.frequency}
                  </div>
                </div>
                <div className="text-xs font-black text-slate-700 dark:text-slate-300 whitespace-nowrap">
                  {formatCurrency(item.amount)}
                </div>
              </div>
            </a>
          ))
        ) : (
          <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-300 dark:text-slate-600 py-6 text-center">
            No upcoming outgoings
          </div>
        )}
      </div>
    </CardContent>
  )
}

function TrendCard({ summary }: { summary: Summary | null }) {
  const points = summary?.monthlyTrend || []
  const max = Math.max(...points.map((p) => p.amount), 1)
  const width = 320
  const height = 60
  const path = points
    .map((point, index) => {
      const x = points.length <= 1 ? 0 : (index / (points.length - 1)) * width
      const y = height - (point.amount / max) * height
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')

  return (
    <CardContent className="p-5 h-full flex flex-col overflow-hidden">
      <div className="shrink-0">
        <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
          Expense Trend
        </h3>
        <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-1">
          Monthly total
        </div>
      </div>

      <div className="mt-3 flex-1 min-h-0">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[72px] overflow-visible" role="img" aria-label="Monthly outgoing trend">
          <path d={path} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-brand-600" />
          {points.map((point, index) => {
            const x = points.length <= 1 ? 0 : (index / (points.length - 1)) * width
            const y = height - (point.amount / max) * height
            return <circle key={point.label} cx={x} cy={y} r="3.5" className="fill-white stroke-brand-600" strokeWidth="2.5" />
          })}
        </svg>
        <div className="grid grid-cols-6 gap-2 mt-1">
          {points.map((point) => (
            <div key={point.label} className="min-w-0">
              <div className="text-[8px] leading-none font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 truncate">
                {point.label}
              </div>
              <div className="text-[9px] leading-tight font-black text-slate-700 dark:text-slate-300 truncate mt-1">
                {formatCurrency(point.amount)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  )
}

export function OutgoingsDashboardWidgets() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getOutgoingsDashboardSummary()
      .then((data) => {
        if (cancelled) return
        setSummary(data)
      })
      .finally(() => {
        if (cancelled) return
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const widgets = useMemo<DashboardWidgetDefinition[]>(() => [
    {
      id: 'outgoings-monthly-total',
      title: 'Monthly Outgoings',
      span: 1 as const,
      content: loading ? (
        <LoadingCard title="Monthly Outgoings" />
      ) : (
        <StatWidget
          title="Monthly Outgoings"
          value={summary?.formattedMonthlyTotal || '$0'}
          subtitle={`${summary?.totalActive || 0} active outgoings`}
        />
      ),
    },
    {
      id: 'outgoings-weekly-total',
      title: 'Weekly Outgoings',
      span: 1 as const,
      content: loading ? (
        <LoadingCard title="Weekly Outgoings" />
      ) : (
        <StatWidget
          title="Weekly Outgoings"
          value={summary?.formattedWeeklyTotal || '$0'}
          subtitle="Normalised weekly total"
        />
      ),
    },
    {
      id: 'outgoings-upcoming',
      title: 'Upcoming Outgoings',
      span: 1 as const,
      rows: 1 as const,
      content: loading ? <LoadingCard title="Upcoming Outgoings" /> : <UpcomingOutgoingsCard summary={summary} />,
    },
    {
      id: 'outgoings-expense-trend',
      title: 'Expense Trend',
      span: 2 as const,
      rows: 1 as const,
      content: loading ? <LoadingCard title="Expense Trend" /> : <TrendCard summary={summary} />,
    },
  ], [loading, summary])

  useDashboardGridRegistration('outgoings-dashboard', widgets)
  return null
}
