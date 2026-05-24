import React from 'react'
import Link from 'next/link'
import { ArrowUpDown, Edit, ExternalLink, Filter, FolderKanban, Plus, Trash2 } from 'lucide-react'
import { getPortfolioItemsAdmin, deletePortfolioItem } from '@/actions/portfolio'
import SearchInput from '@/components/admin/SearchInput'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { AdminTopBarIconButtonLink } from '@/components/admin/AdminTopBarIconButton'
import { AdminTopBarLinkMenu } from '@/components/admin/AdminTopBarLinkMenu'
import { AdminActiveFilters } from '@/components/admin/AdminActiveFilters'
import { AdminListFooterBar } from '@/components/admin/AdminListFooterBar'
import { AdminCard, AdminCardContent } from '@/components/admin/AdminCard'
import { AdminDataTable, type AdminDataTableColumn } from '@/components/admin/AdminDataTable'
import { AdminIconButton, AdminIconButtonLink } from '@/components/admin/AdminIconButton'
import { AdminEmptyStateContent } from '@/components/admin/AdminTableEmptyState'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

type Row = any

function toIdString(raw: unknown): string {
  if (raw === null || raw === undefined) return ''
  if (typeof raw === 'string' || typeof raw === 'number') return String(raw)
  if (typeof raw === 'object' && (raw as any)?.id) return String((raw as any).id)
  return ''
}

function toImageUrl(raw: any): string | undefined {
  if (!raw) return undefined
  if (typeof raw === 'object' && raw?.url) return String(raw.url)
  return undefined
}

function formatStatus(value: unknown): string {
  return String(value || 'active')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function statusBadgeClass(value: unknown) {
  const status = String(value || '').toLowerCase()
  if (status === 'active' || status === 'published') {
    return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300'
  }
  if (status === 'paused' || status === 'draft') {
    return 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300'
  }
  if (status === 'archived') {
    return 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
  }
  return 'bg-brand-50 text-brand-700 dark:bg-brand-950/30 dark:text-brand-300'
}

export default async function PortfolioAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; sort?: string; clientStatus?: string }>
}) {
  const { search, sort, clientStatus } = await searchParams
  const portfolioRes = await getPortfolioItemsAdmin(search, sort || '-createdAt', clientStatus)
  const portfolioItems = portfolioRes?.docs || []

  const getSortLink = (field: string) => {
    const nextOrder = sort === field ? `-${field}` : field
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (clientStatus) params.set('clientStatus', clientStatus)
    params.set('sort', nextOrder)
    return `?${params.toString()}`
  }

  const getClientStatusLink = (nextStatus: string) => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (sort) params.set('sort', sort)
    if (nextStatus !== 'all') params.set('clientStatus', nextStatus)
    return `?${params.toString()}`
  }

  const columns: Array<AdminDataTableColumn<Row>> = [
    {
      id: 'title',
      header: (
        <Link
          href={getSortLink('title')}
          className="flex items-center cursor-pointer hover:text-indigo-600 transition-colors"
        >
          Item <ArrowUpDown className="ml-2 h-3 w-3" />
        </Link>
      ),
      cell: (row) => {
        const url = toImageUrl(row?.logo) || row?.logoUrl || toImageUrl(row?.featuredImage)
        return (
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-slate-400 dark:text-slate-500 text-sm border-2 border-white dark:border-slate-700 shadow-sm transition-transform group-hover:scale-110 group-hover:bg-white dark:group-hover:bg-slate-700 group-hover:text-brand-600 uppercase italic text-center leading-[0.8] overflow-hidden">
              {url ? (
                <img src={url} alt={row?.clientCompany || row?.title || ''} className="w-full h-full object-cover" />
              ) : (
                <FolderKanban className="w-5 h-5 text-slate-300 dark:text-slate-700" />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-black text-slate-900 dark:text-white text-base leading-none mb-1 tracking-tight">
                {row?.title || 'Untitled'}
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center uppercase font-black tracking-widest truncate">
                /portfolio/{row?.slug || '-'}
              </p>
            </div>
          </div>
        )
      },
    },
    {
      id: 'type',
      header: (
        <Link
          href={getSortLink('projectType')}
          className="flex items-center cursor-pointer hover:text-indigo-600 transition-colors"
        >
          Type <ArrowUpDown className="ml-2 h-3 w-3" />
        </Link>
      ),
      cell: (row) => (
        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight">
          {row?.projectType || '-'}
        </span>
      ),
    },
    {
      id: 'client',
      header: (
        <Link
          href={getSortLink('clientCompany')}
          className="flex items-center cursor-pointer hover:text-indigo-600 transition-colors"
        >
          Client <ArrowUpDown className="ml-2 h-3 w-3" />
        </Link>
      ),
      cell: (row) => (
        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight">
          {row?.clientCompany || '-'}
        </span>
      ),
    },
    {
      id: 'website',
      header: 'Website',
      cell: (row) =>
        row?.websiteUrl ? (
          <a
            href={row.websiteUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-600 hover:text-brand-500 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Visit
          </a>
        ) : (
          <span className="text-sm font-bold text-slate-300 dark:text-slate-600">-</span>
        ),
    },
    {
      id: 'contact',
      header: 'Contact',
      cell: (row) => (
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            {row?.contactName || '-'}
          </p>
          {row?.contactEmail ? (
            <a
              href={`mailto:${row.contactEmail}`}
              className="mt-1 block truncate text-[10px] uppercase tracking-widest text-slate-400 hover:text-brand-600 transition-colors"
            >
              {row.contactEmail}
            </a>
          ) : null}
        </div>
      ),
    },
    {
      id: 'status',
      header: (
        <Link
          href={getSortLink('status')}
          className="flex items-center cursor-pointer hover:text-indigo-600 transition-colors"
        >
          Status <ArrowUpDown className="ml-2 h-3 w-3" />
        </Link>
      ),
      cell: (row) => (
        <div className="flex flex-col items-start gap-2">
          <span
            className={cn('inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest', statusBadgeClass(row?.clientStatus))}
          >
            {formatStatus(row?.clientStatus)}
          </span>
          <span
            className={cn('inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest', statusBadgeClass(row?.status))}
          >
            {formatStatus(row?.status || 'draft')}
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
          <AdminIconButtonLink href={`/admin/portfolio/${toIdString(row?.id)}`} title="Edit portfolio item">
            <Edit className="w-4 h-4" />
          </AdminIconButtonLink>
          <form
            action={async () => {
              'use server'
              await deletePortfolioItem(row?.id)
            }}
          >
            <AdminIconButton type="submit" variant="danger" title="Delete portfolio item">
              <Trash2 className="w-4 h-4" />
            </AdminIconButton>
          </form>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <AdminPageHeader
        title="Portfolio"
        subtitle="Client work, jobs, and public portfolio entries"
        titleClassName="uppercase"
        center={<SearchInput placeholder="Search title, client, type..." />}
      >
        <AdminTopBarLinkMenu
          ariaLabel="Filter by client status"
          title="Client Status"
          icon={<Filter className="w-4 h-4" />}
          items={[
            { value: 'all', label: 'All' },
            { value: 'lead', label: 'Lead' },
            { value: 'active', label: 'Active' },
            { value: 'paused', label: 'Paused' },
            { value: 'complete', label: 'Complete' },
            { value: 'archived', label: 'Archived' },
          ].map((item) => ({
            href: getClientStatusLink(item.value),
            label: item.label,
            active: (clientStatus || 'all') === item.value,
          }))}
        />
        <AdminTopBarIconButtonLink href="/admin/portfolio/new" title="Create portfolio item">
          <Plus className="w-4 h-4" />
        </AdminTopBarIconButtonLink>
      </AdminPageHeader>

      <AdminActiveFilters
        filters={[
          ...(search ? [{ label: 'Search', value: search }] : []),
          ...(clientStatus && clientStatus !== 'all' ? [{ label: 'Client Status', value: formatStatus(clientStatus) }] : []),
        ]}
        resetHref="/admin/portfolio"
      />

      <AdminCard>
        <AdminCardContent>
          <AdminDataTable
            data={portfolioItems}
            columns={columns}
            getRowKey={(row) => toIdString(row?.id)}
            emptyState={<AdminEmptyStateContent title="No portfolio found" />}
          />
        </AdminCardContent>
      </AdminCard>

      <AdminListFooterBar
        label={
          <>
            Showing <span className="text-slate-900 dark:text-white">{portfolioItems.length}</span> portfolio items
          </>
        }
      />
    </div>
  )
}
