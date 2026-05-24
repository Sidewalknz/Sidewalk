import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getMediaPaged, deleteMedia, deleteUploadFile, getUploadCollections } from '@/actions/media'
import { ArrowUpDown, ExternalLink, FileText, Image as ImageIcon, Trash2, Plus, Edit3, Edit } from 'lucide-react'
import SearchInput from '@/components/admin/SearchInput'
import { cn } from '@/lib/utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { AdminActiveFilters } from '@/components/admin/AdminActiveFilters'
import { AdminCard, AdminCardContent } from '@/components/admin/AdminCard'
import { AdminIconButtonLink, AdminIconButton } from '@/components/admin/AdminIconButton'
import { AdminTopBarIconButtonLink } from '@/components/admin/AdminTopBarIconButton'
import { AdminListFooterBar } from '@/components/admin/AdminListFooterBar'
import { AdminEmptyStateContent } from '@/components/admin/AdminTableEmptyState'

export default async function MediaPage({
    searchParams,
}: {
    searchParams: Promise<{ search?: string, sort?: string, page?: string, limit?: string }>
}) {
    const { search, sort, page, limit } = await searchParams
    const currentPage = Number(page) || 1
    const currentLimit = Number(limit) || 10
    const currentSort = sort || '-createdAt'
    const uploadCollections = await getUploadCollections()

    // Fetch across all upload collections; no collection filtering in UI.
    // We oversample based on the current page so paging stays stable.
    const limitForAll = Math.max(100, currentLimit * currentPage * 3)
    const docsByCollection = await Promise.all(
        uploadCollections.map(async (slug) => {
            const res = await getMediaPaged(search, '-createdAt', 1, limitForAll, slug)
            const docs = res?.docs || []
            return docs.map((d: any) => ({ ...d, __collection: slug }))
        }),
    )

    const compareBySort = (a: any, b: any) => {
        const desc = currentSort.startsWith('-')
        const field = desc ? currentSort.slice(1) : currentSort

        const av = a?.[field]
        const bv = b?.[field]

        const looksLikeDate =
            field.toLowerCase().includes('date') ||
            field.toLowerCase().includes('createdat') ||
            field.toLowerCase().includes('updatedat')

        let cmp = 0
        if (looksLikeDate) {
            const aTime = new Date(av || 0).getTime()
            const bTime = new Date(bv || 0).getTime()
            cmp = aTime - bTime
        } else if (typeof av === 'number' && typeof bv === 'number') {
            cmp = av - bv
        } else {
            cmp = String(av ?? '').localeCompare(String(bv ?? ''), undefined, { numeric: true, sensitivity: 'base' })
        }

        return desc ? -cmp : cmp
    }

    const merged = docsByCollection.flat().sort(compareBySort)

    const totalDocs = merged.length
    const startIdx = (currentPage - 1) * currentLimit
    const media = merged.slice(startIdx, startIdx + currentLimit)

    const getSortLink = (field: string) => {
        const isDesc = currentSort === `-${field}`
        const isAsc = currentSort === field
        const nextOrder = isAsc ? `-${field}` : field

        const params = new URLSearchParams()
        if (search) params.set('search', search)
        if (limit) params.set('limit', limit)
        params.set('page', '1')
        params.set('sort', isDesc ? field : nextOrder)
        return `?${params.toString()}`
    }

    const getPagingLink = (newPage: number) => {
        const params = new URLSearchParams()
        if (search) params.set('search', search)
        if (sort) params.set('sort', sort)
        if (limit) params.set('limit', limit)
        params.set('page', newPage.toString())
        return `?${params.toString()}`
    }

    const getLimitLink = (newLimit: number) => {
        const params = new URLSearchParams()
        if (search) params.set('search', search)
        if (sort) params.set('sort', sort)
        params.set('page', '1')
        params.set('limit', newLimit.toString())
        return `?${params.toString()}`
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AdminPageHeader
                title="Media"
                subtitle="All uploaded files across modules"
                center={<SearchInput placeholder="Search media..." />}
            >
                <AdminTopBarIconButtonLink
                    href="/admin/media/import"
                    title="New media"
                >
                    <Plus className="w-4 h-4" />
                </AdminTopBarIconButtonLink>
                <AdminTopBarIconButtonLink href="/admin/media/quick-edit" title="Quick edit">
                    <Edit3 className="w-4 h-4" />
                </AdminTopBarIconButtonLink>
            </AdminPageHeader>

            <AdminActiveFilters
                filters={search ? [{ label: 'Search', value: search }] : []}
                resetHref="/admin/media"
            />
            
            <AdminCard>
                <AdminCardContent>
                    <Table className="w-full text-left border-collapse">
                        <TableHeader className="[&_tr]:border-b-0">
                            <TableRow className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 hover:bg-transparent">
                                    <TableHead className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] h-auto">
                                        File
                                    </TableHead>
                                    <TableHead className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] h-auto">
                                        <Link href={getSortLink('name')} className="inline-flex items-center hover:text-indigo-600 transition-colors">
                                            Name <ArrowUpDown className="ml-2 h-3 w-3" />
                                        </Link>
                                    </TableHead>
                                    <TableHead className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] h-auto">
                                        <Link href={getSortLink('mimeType')} className="inline-flex items-center hover:text-indigo-600 transition-colors">
                                            Type <ArrowUpDown className="ml-2 h-3 w-3" />
                                        </Link>
                                    </TableHead>
                                    <TableHead className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] h-auto">
                                        <Link href={getSortLink('filesize')} className="inline-flex items-center hover:text-indigo-600 transition-colors">
                                            Size <ArrowUpDown className="ml-2 h-3 w-3" />
                                        </Link>
                                    </TableHead>
                                    <TableHead className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] h-auto">
                                        <Link href={getSortLink('createdAt')} className="inline-flex items-center hover:text-indigo-600 transition-colors">
                                            Added <ArrowUpDown className="ml-2 h-3 w-3" />
                                        </Link>
                                    </TableHead>
                                    <TableHead className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] h-auto">
                                        <Link href={getSortLink('alt')} className="inline-flex items-center hover:text-indigo-600 transition-colors">
                                            Alt Text <ArrowUpDown className="ml-2 h-3 w-3" />
                                        </Link>
                                    </TableHead>
                                    <TableHead className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right h-auto">Actions</TableHead>
                                </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-slate-50 dark:divide-slate-800/70">
                                {media.map((item: any) => (
                                    <TableRow key={item.id} className="group hover:bg-brand-50/30 transition-all duration-300">
                                        <TableCell className="px-8 py-6">
                                            <div className="flex items-center justify-center">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-2 border-white dark:border-slate-700 shadow-sm overflow-hidden">
                                                    {item.mimeType?.startsWith('image/') ? (
                                                        <Image 
                                                            src={item.url} 
                                                            alt={item.alt || item.filename} 
                                                            width={48}
                                                            height={48}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <FileText className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-8 py-6">
                                            <span className={cn(
                                                "text-xs font-bold",
                                                item.name ? "text-slate-700 dark:text-slate-300" : "text-slate-300 dark:text-slate-600"
                                            )}>
                                                {item.name || '—'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-8 py-6">
                                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                {item.mimeType || '—'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-8 py-6">
                                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                {typeof item.filesize === 'number' ? `${(item.filesize / 1024 / 1024).toFixed(2)} MB` : '—'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-8 py-6">
                                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '—'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-8 py-6">
                                            <span className={cn(
                                                "text-xs font-medium",
                                                item.alt ? "text-slate-600 dark:text-slate-300" : "italic text-slate-300 dark:text-slate-600"
                                            )}>
                                                {item.alt || 'No alt specified'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-8 py-6">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                                                <AdminIconButtonLink
                                                    href={`/admin/media/${encodeURIComponent(item.__collection || 'media')}/${encodeURIComponent(String(item.id))}`}
                                                    title="Edit File"
                                                    variant="brand"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </AdminIconButtonLink>
                                                <AdminIconButtonLink
                                                    href={item.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    title="Open File"
                                                    variant="brand"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </AdminIconButtonLink>
                                                <form action={async () => {
                                                    'use server'
                                                    const docCollection = item?.__collection
                                                    if (!docCollection || docCollection === 'media') {
                                                        await deleteMedia(item.id)
                                                    } else {
                                                        await deleteUploadFile(docCollection, item.id)
                                                    }
                                                }}>
                                                    <AdminIconButton type="submit" title="Delete File" variant="danger">
                                                        <Trash2 className="w-4 h-4" />
                                                    </AdminIconButton>
                                                </form>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {media.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="px-8 py-20 text-center">
                                            <AdminEmptyStateContent title="No media found" />
                                        </TableCell>
                                    </TableRow>
                                )}
                        </TableBody>
                    </Table>
                </AdminCardContent>
            </AdminCard>

            <AdminListFooterBar
                label="Media per page"
                currentLimit={currentLimit}
                getLimitHref={getLimitLink}
                currentPage={currentPage}
                totalPages={Math.max(1, Math.ceil(totalDocs / currentLimit))}
                getPageHref={getPagingLink}
            />
        </div>
    )
}
