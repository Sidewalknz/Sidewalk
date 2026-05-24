import React from 'react'
import { getMediaPaged } from '@/actions/media'
import { AdminListFooterBar } from '@/components/admin/AdminListFooterBar'
import { MediaQuickEditTable } from '@/components/admin/MediaQuickEditTable'

export const metadata = {
    title: 'Quick Edit Media | Admin',
    description: 'Bulk edit your media alt text spreadsheet style',
}

export default async function QuickEditMediaPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const sParams = await searchParams
    const search = typeof sParams.search === 'string' ? sParams.search : undefined
    const currentPage = Number(typeof sParams.page === 'string' ? sParams.page : undefined) || 1
    const currentLimit = Number(typeof sParams.limit === 'string' ? sParams.limit : undefined) || 500

    const mediaRes = await getMediaPaged(search, '-createdAt', currentPage, currentLimit)
    const initialMedia = mediaRes.docs || []

    const getPageHref = (page: number) => {
        const params = new URLSearchParams()
        if (search) params.set('search', search)
        if (currentLimit !== 500) params.set('limit', String(currentLimit))
        params.set('page', String(page))
        return `?${params.toString()}`
    }

    const getLimitHref = (limit: number) => {
        const params = new URLSearchParams()
        if (search) params.set('search', search)
        if (limit !== 500) params.set('limit', String(limit))
        params.set('page', '1')
        return `?${params.toString()}`
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <MediaQuickEditTable key={`${currentPage}-${currentLimit}-${search || ''}`} initialMedia={initialMedia} />

            <AdminListFooterBar
                label={
                    <>
                        Showing <span className="text-slate-900 dark:text-white">{initialMedia.length}</span> of{' '}
                        <span className="text-slate-900 dark:text-white">{mediaRes.totalDocs || initialMedia.length}</span> media items
                    </>
                }
                currentPage={mediaRes.page || currentPage}
                totalPages={mediaRes.totalPages || 1}
                getPageHref={getPageHref}
                currentLimit={currentLimit}
                limitOptions={[100, 250, 500]}
                getLimitHref={getLimitHref}
                showLimitSelector
            />
        </div>
    )
}
