'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, FileText, Image as ImageIcon, Loader2, Save, Search } from 'lucide-react'
import { bulkUpdateMedia } from '@/actions/media'
import { AdminCard, AdminCardContent } from '@/components/admin/AdminCard'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export function MediaQuickEditTable({ initialMedia }: { initialMedia: any[] }) {
    const router = useRouter()
    const [media, setMedia] = useState<any[]>(initialMedia)
    const [modifiedIds, setModifiedIds] = useState<Set<string>>(new Set())
    const [isSaving, setIsSaving] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        setMedia(initialMedia)
        setModifiedIds(new Set())
        setSearchQuery('')
    }, [initialMedia])

    const filteredMedia = useMemo(() => {
        if (!searchQuery) return media
        const q = searchQuery.toLowerCase()
        return media.filter((m) => (
            (m.filename && m.filename.toLowerCase().includes(q)) ||
            (m.name && m.name.toLowerCase().includes(q)) ||
            (m.alt && m.alt.toLowerCase().includes(q)) ||
            (m.mimeType && m.mimeType.toLowerCase().includes(q))
        ))
    }, [media, searchQuery])

    const getRowKey = (item: any) => `${item.__collection || 'media'}:${item.id}`

    const handleChange = (key: string, patch: { name?: string, alt?: string }) => {
        setMedia((prev) => prev.map((m) => (getRowKey(m) === key ? { ...m, ...patch } : m)))
        setModifiedIds((prev) => new Set(prev).add(key))
    }

    const handleSave = async () => {
        if (modifiedIds.size === 0) return
        setIsSaving(true)

        const updates = Array.from(modifiedIds).map((id) => {
            const item = media.find((m) => getRowKey(m) === id)
            return {
                id: String(item?.id || ''),
                collection: item?.__collection || 'media',
                data: { alt: item?.alt || '', name: item?.name || '' },
            }
        })

        try {
            const result = await bulkUpdateMedia(updates)
            if (result.success) {
                setModifiedIds(new Set())
                router.refresh()
            }
        } catch (e) {
            console.error(e)
            alert('Failed to save changes. Please try again.')
        } finally {
            setIsSaving(false)
        }
    }

    const modifiedCount = modifiedIds.size

    return (
        <div className="space-y-8">
            <AdminPageHeader
                title="Quick Edit"
                subtitle="Dynamic spreadsheet editor"
                backHref="/admin/media"
                center={
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            value={searchQuery}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                            placeholder="Search by filename, name, or alt..."
                            className="w-full pl-9 h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700/50 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium text-sm shadow-none"
                        />
                    </div>
                }
            >
                {modifiedCount > 0 ? (
                    <span className="text-xs font-black uppercase tracking-widest text-brand-600 dark:text-brand-400 flex items-center gap-2 mr-2">
                        <AlertCircle className="w-4 h-4" />
                        {modifiedCount} unsaved {modifiedCount === 1 ? 'change' : 'changes'}
                    </span>
                ) : null}
                <Button
                    onClick={handleSave}
                    disabled={modifiedCount === 0 || isSaving}
                    className={cn(
                        "h-12 px-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center gap-2 shadow-xl hover:shadow-2xl",
                        modifiedCount === 0
                            ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none hover:shadow-none"
                            : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-black dark:hover:bg-slate-100"
                    )}
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            Save Changes
                        </>
                    )}
                </Button>
            </AdminPageHeader>

            <AdminCard>
                <AdminCardContent className="p-0">
                    <div className="overflow-auto rounded-[2.5rem]">
                        <table className="w-full border-collapse min-w-[900px]">
                            <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                <tr>
                                    <th className="text-left px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] w-[96px]">
                                        Asset
                                    </th>
                                    <th className="text-left px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                                        Name
                                    </th>
                                    <th className="text-left px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                                        Alt
                                    </th>
                                    <th className="text-left px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                                        Type
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/70">
                                {filteredMedia.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-16 text-center text-slate-500 text-sm font-bold">
                                            {searchQuery ? `No media found matching "${searchQuery}".` : 'No media found.'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredMedia.map((item: any) => {
                                        const rowKey = getRowKey(item)
                                        const isModified = modifiedIds.has(rowKey)
                                        return (
                                            <tr
                                                key={rowKey}
                                                className={cn(
                                                    "group hover:bg-brand-50/30 transition-all duration-300",
                                                    isModified && "bg-brand-50/30 dark:bg-brand-500/5"
                                                )}
                                            >
                                                <td className="px-8 py-6 w-[96px]">
                                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-2 border-white dark:border-slate-700 shadow-sm overflow-hidden">
                                                        {item.mimeType?.startsWith('image/') ? (
                                                            <img src={item.url} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <ImageIcon className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="px-8 py-6">
                                                    <Input
                                                        value={item.name || ''}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(rowKey, { name: e.target.value })}
                                                        className="h-11 w-[240px] border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 focus:ring-2 focus:ring-brand-500/20 transition-all font-medium text-sm shadow-none"
                                                        placeholder="Name"
                                                    />
                                                </td>

                                                <td className="px-8 py-6">
                                                    <Input
                                                        value={item.alt || ''}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(rowKey, { alt: e.target.value })}
                                                        className="h-11 w-full min-w-[320px] border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 focus:ring-2 focus:ring-brand-500/20 transition-all font-medium text-sm shadow-none"
                                                        placeholder="Alt text"
                                                    />
                                                </td>

                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="w-4 h-4 text-slate-400" />
                                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                            {item.mimeType || '—'}
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </AdminCardContent>
            </AdminCard>
        </div>
    )
}
