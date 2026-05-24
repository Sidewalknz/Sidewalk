import React from 'react'
import Link from 'next/link'
import { ArrowUpDown, Edit, Filter, Plus, Trash2 } from 'lucide-react'
import { deleteOutgoing, getOutgoingsAdmin, getOutgoingsDashboardSummary } from '@/actions/outgoings'
import SearchInput from '@/components/admin/SearchInput'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { AdminTopBarIconButtonLink } from '@/components/admin/AdminTopBarIconButton'
import { AdminTopBarLinkMenu } from '@/components/admin/AdminTopBarLinkMenu'
import { AdminActiveFilters } from '@/components/admin/AdminActiveFilters'
import { AdminListFooterBar } from '@/components/admin/AdminListFooterBar'
import { AdminCard, AdminCardContent } from '@/components/admin/AdminCard'
import { AdminDataTable, type AdminDataTableColumn } from '@/components/admin/AdminDataTable'
import { AdminIconButton, AdminIconButtonLink } from '@/components/admin/AdminIconButton'
import { CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

type Row = any

function toIdString(raw: unknown): string {
  if (raw === null || raw === undefined) return ''
  if (typeof raw === 'string' || typeof raw === 'number') return String(raw)
  if (typeof raw === 'object' && (raw as any)?.id) return String((raw as any).id)
  return ''
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-NZ', {
    style: 'currency',
    currency: 'NZD',
    maximumFractionDigits: Number(value) % 1 === 0 ? 0 : 2,
  }).format(Number(value || 0))
}

function formatDate(raw?: string | null) {
  if (!raw) return '—'
  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('en-NZ', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}

function asMonthlyAmount(row: Row) {
  const amount = Number(row?.amount || 0)
  if (row?.frequency === 'weekly') return (amount * 52) / 12
  if (row?.frequency === 'yearly') return amount / 12
  return amount
}

function SummaryCard({ title, value, subtitle }: { title: string; value: string; subtitle: string }) {
  return (
    <AdminCard>
      <CardContent className="p-6">
        <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">
          {title}
        </h3>
        <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{value}</div>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-bold pt-3">{subtitle}</p>
      </CardContent>
    </AdminCard>
  )
}

export default async function OutgoingsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; sort?: string; status?: string; page?: string; limit?: string }>
}) {
  const { search, sort, status, page, limit } = await searchParams
  const currentPage = Number(page || 1) || 1
  const currentLimit = Number(limit || 1000) || 1000
  const [outgoingsRes, summary] = await Promise.all([
    getOutgoingsAdmin(search, sort || '-createdAt', status || 'all', currentPage, currentLimit),
    getOutgoingsDashboardSummary(),
  ])
  const outgoings = outgoingsRes?.docs || []

  const baseParams = new URLSearchParams()
  if (search) baseParams.set('search', search)
  if (status && status !== 'all') baseParams.set('status', status)

  const getSortLink = (field: string) => {
    const nextOrder = sort === field ? `-${field}` : field
    const params = new URLSearchParams(baseParams)
    params.set('sort', nextOrder)
    return `?${params.toString()}`
  }

  const getStatusHref = (value: string) => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (sort) params.set('sort', sort)
    if (value !== 'all') params.set('status', value)
    return params.toString() ? `/admin/outgoings?${params.toString()}` : '/admin/outgoings'
  }

  const getPageHref = (page: number) => {
    const params = new URLSearchParams(baseParams)
    if (sort) params.set('sort', sort)
    if (currentLimit !== 1000) params.set('limit', String(currentLimit))
    if (page > 1) params.set('page', String(page))
    return `/admin/outgoings${params.toString() ? `?${params.toString()}` : ''}`
  }

  const columns: Array<AdminDataTableColumn<Row>> = [
    {
      id: 'name',
      header: (
        <Link href={getSortLink('name')} className="flex items-center cursor-pointer hover:text-indigo-600 transition-colors">
          Outgoing <ArrowUpDown className="ml-2 h-3 w-3" />
        </Link>
      ),
      cell: (row) => (
        <div className="min-w-0">
          <p className="font-black text-slate-900 dark:text-white text-base leading-none mb-1 tracking-tight">
            {row?.name || 'Untitled'}
          </p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest truncate">
            {row?.category || 'Uncategorised'}
          </p>
        </div>
      ),
    },
    {
      id: 'amount',
      header: (
        <Link href={getSortLink('amount')} className="flex items-center cursor-pointer hover:text-indigo-600 transition-colors">
          Amount <ArrowUpDown className="ml-2 h-3 w-3" />
        </Link>
      ),
      cell: (row) => (
        <div>
          <div className="text-sm font-black text-slate-900 dark:text-white">{formatCurrency(row?.amount)}</div>
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
            {row?.frequency || 'monthly'}
          </div>
        </div>
      ),
    },
    {
      id: 'monthly',
      header: 'Monthly',
      cell: (row) => (
        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{formatCurrency(asMonthlyAmount(row))}</span>
      ),
    },
    {
      id: 'startDate',
      header: (
        <Link href={getSortLink('startDate')} className="flex items-center cursor-pointer hover:text-indigo-600 transition-colors">
          Start <ArrowUpDown className="ml-2 h-3 w-3" />
        </Link>
      ),
      cell: (row) => <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{formatDate(row?.startDate)}</span>,
    },
    {
      id: 'status',
      header: (
        <Link href={getSortLink('status')} className="flex items-center cursor-pointer hover:text-indigo-600 transition-colors">
          Status <ArrowUpDown className="ml-2 h-3 w-3" />
        </Link>
      ),
      cell: (row) => (
        <div className="inline-flex items-center gap-2">
          <span
            className={cn(
              'w-2 h-2 rounded-full',
              row?.status === 'active' ? 'bg-emerald-500 animate-pulse' : row?.status === 'paused' ? 'bg-amber-500' : 'bg-slate-300',
            )}
          />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">
            {row?.status || 'active'}
          </span>
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      cellClassName: 'text-right',
      cell: (row) => (
        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
          <AdminIconButtonLink href={`/admin/outgoings/${toIdString(row?.id)}`} title="Edit outgoing">
            <Edit className="w-4 h-4" />
          </AdminIconButtonLink>
          <form
            action={async () => {
              'use server'
              await deleteOutgoing(row?.id)
            }}
          >
            <AdminIconButton type="submit" variant="danger" title="Delete outgoing">
              <Trash2 className="w-4 h-4" />
            </AdminIconButton>
          </form>
        </div>
      ),
    },
  ]

  const activeFilters = [
    ...(search ? [{ label: 'Search', value: search }] : []),
    ...(status && status !== 'all' ? [{ label: 'Status', value: status }] : []),
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <AdminPageHeader
        title="Outgoings"
        subtitle="Track recurring business expenses"
        titleClassName="uppercase"
        center={<SearchInput placeholder="Search outgoings..." />}
      >
        <AdminTopBarLinkMenu
          title="Status"
          ariaLabel="Filter by status"
          icon={<Filter className="w-4 h-4" />}
          items={[
            { label: 'All', href: getStatusHref('all'), active: !status || status === 'all' },
            { label: 'Active', href: getStatusHref('active'), active: status === 'active' },
            { label: 'Paused', href: getStatusHref('paused'), active: status === 'paused' },
            { label: 'Ended', href: getStatusHref('ended'), active: status === 'ended' },
          ]}
        />
        <AdminTopBarIconButtonLink href="/admin/outgoings/new" title="Create outgoing">
          <Plus className="w-4 h-4" />
        </AdminTopBarIconButtonLink>
      </AdminPageHeader>

      <AdminActiveFilters filters={activeFilters} resetHref="/admin/outgoings" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard title="Weekly Expenses" value={summary.formattedWeeklyTotal} subtitle={`${summary.totalActive} active outgoings`} />
        <SummaryCard title="Monthly Expenses" value={summary.formattedMonthlyTotal} subtitle="Normalised monthly total" />
        <SummaryCard title="Yearly Expenses" value={summary.formattedYearlyTotal} subtitle="Projected yearly total" />
      </div>

      <AdminCard>
        <AdminCardContent>
          <AdminDataTable
            data={outgoings}
            columns={columns}
            getRowKey={(row) => toIdString(row?.id)}
            emptyState={
              <div className="py-16 text-center">
                <p className="font-black text-slate-700 dark:text-slate-200">No outgoings found</p>
                <p className="mt-3 text-sm font-medium text-slate-400 dark:text-slate-500">Try adjusting your search or filters.</p>
              </div>
            }
          />
        </AdminCardContent>
      </AdminCard>

      <AdminListFooterBar
        label={
          <>
            Showing <span className="text-slate-900 dark:text-white">{outgoings.length}</span> of{' '}
            <span className="text-slate-900 dark:text-white">{outgoingsRes.totalDocs || outgoings.length}</span> outgoings
          </>
        }
        currentPage={outgoingsRes.page || currentPage}
        totalPages={outgoingsRes.totalPages || 1}
        getPageHref={getPageHref}
      />
    </div>
  )
}
