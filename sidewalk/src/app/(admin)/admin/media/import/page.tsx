'use client'

import React, { useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { CheckCircle, AlertCircle, UploadCloud, Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createMediaBulk } from '@/actions/media'
import { cn } from '@/lib/utils'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { AdminCard, AdminCardContent } from '@/components/admin/AdminCard'

type BulkFailure = {
    filename?: string
    message: string
}

type BulkResult = {
    success: boolean
    createdCount: number
    errorCount: number
    errors: BulkFailure[]
}

export default function ImportMediaPage() {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [files, setFiles] = useState<File[]>([])
    const [isImporting, setIsImporting] = useState(false)
    const [result, setResult] = useState<BulkResult | null>(null)
    const [isDragging, setIsDragging] = useState(false)

    const totalSizeMb = useMemo(() => {
        const total = files.reduce((acc, f) => acc + (f?.size || 0), 0)
        return total / 1024 / 1024
    }, [files])

    const onPickFiles = (picked: FileList | null) => {
        if (!picked?.length) return
        const next = Array.from(picked)
        setFiles(prev => {
            const byKey = new Map<string, File>()
            ;[...prev, ...next].forEach(f => byKey.set(`${f.name}:${f.size}`, f))
            return Array.from(byKey.values())
        })
        setResult(null)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        onPickFiles(e.dataTransfer.files)
    }

    const removeFile = (key: string) => {
        setFiles(prev => prev.filter(f => `${f.name}:${f.size}` !== key))
        setResult(null)
    }

    const clearFiles = () => {
        setFiles([])
        setResult(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const handleImport = async () => {
        if (!files.length) return
        setIsImporting(true)
        setResult(null)

        const formData = new FormData()
        files.forEach(f => formData.append('files', f))

        try {
            const res = await createMediaBulk(formData)
            setResult(res)
        } catch (e) {
            console.error(e)
            setResult({
                success: false,
                createdCount: 0,
                errorCount: files.length,
                errors: [{ message: 'Bulk upload failed. Please try again.' }],
            })
        } finally {
            setIsImporting(false)
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AdminPageHeader
                title="New Media"
                subtitle="Bulk upload files (name and alt default to file name)"
                backHref="/admin/media"
            />

            <AdminCard>
                <AdminCardContent className="p-8 space-y-6">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                            {files.length} file{files.length === 1 ? '' : 's'} • {totalSizeMb.toFixed(2)} MB
                        </div>
                    </div>

                    <label
                        htmlFor="media-bulk-upload"
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={cn(
                            "block w-full rounded-[2.5rem] border-2 border-dashed p-10 text-center transition-all cursor-pointer",
                            isDragging
                                ? "bg-brand-50 dark:bg-brand-900/20 border-brand-400 shadow-xl shadow-brand-100 dark:shadow-brand-900/20 scale-[1.01]"
                                : "bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 hover:border-brand-300 dark:hover:border-brand-500/50"
                        )}
                    >
                        <div className="mx-auto w-16 h-16 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                            <UploadCloud className="w-7 h-7 text-slate-400 dark:text-slate-500" />
                        </div>
                        <p className="mt-4 text-sm font-black text-slate-900 dark:text-white uppercase italic">
                            Drag &amp; drop files here
                        </p>
                        <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">
                            or click to browse
                        </p>
                        <input
                            ref={fileInputRef}
                            id="media-bulk-upload"
                            type="file"
                            multiple
                            className="sr-only"
                            onChange={(e) => onPickFiles(e.target.files)}
                        />
                    </label>

                    {files.length > 0 && (
                        <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 overflow-hidden">
                            <div className="max-h-[360px] overflow-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">File</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Size</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Remove</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/70">
                                        {files.map((f) => {
                                            const key = `${f.name}:${f.size}`
                                            return (
                                                <tr key={key} className="hover:bg-brand-50/30 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-black text-slate-900 dark:text-white italic truncate">{f.name}</p>
                                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{f.type || 'unknown'}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{(f.size / 1024 / 1024).toFixed(2)} MB</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={() => removeFile(key)}
                                                            className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400 hover:text-rose-600 transition-all active:scale-95"
                                                            title="Remove"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                            Tip: Use <span className="font-black">Quick Edit</span> after import to adjust alt text at scale.
                        </div>
                        <Button
                            onClick={handleImport}
                            disabled={!files.length || isImporting}
                            className={cn(
                                "h-12 px-8 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95 flex items-center gap-2",
                                !files.length ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed" : "bg-slate-900 dark:bg-white dark:text-slate-900 text-white hover:bg-black dark:hover:bg-slate-100"
                            )}
                        >
                            {isImporting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <UploadCloud className="w-4 h-4" />
                                    Upload
                                </>
                            )}
                        </Button>
                    </div>

                    {result && (
                        <div className={cn(
                            "rounded-3xl border p-6",
                            result.success
                                ? "bg-emerald-50/60 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/20"
                                : "bg-rose-50/60 dark:bg-rose-900/10 border-rose-100 dark:border-rose-900/20"
                        )}>
                            <div className="flex items-start gap-4">
                                {result.success ? (
                                    <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                                ) : (
                                    <AlertCircle className="w-6 h-6 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
                                )}
                                <div className="space-y-2 min-w-0">
                                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                        Uploaded {result.createdCount} file{result.createdCount === 1 ? '' : 's'}
                                        {result.errorCount ? ` • ${result.errorCount} error${result.errorCount === 1 ? '' : 's'}` : ''}
                                    </p>
                                    {result.errors?.length ? (
                                        <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">Failures</p>
                                            <ul className="space-y-1">
                                                {result.errors.slice(0, 8).map((e, idx) => (
                                                    <li key={idx} className="truncate">
                                                        <span className="font-black">{e.filename || 'Unknown file'}:</span> {e.message}
                                                    </li>
                                                ))}
                                            </ul>
                                            {result.errors.length > 8 && (
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-2">
                                                    +{result.errors.length - 8} more…
                                                </p>
                                            )}
                                        </div>
                                    ) : null}
                                    <div className="pt-2">
                                        <Link
                                            href="/admin/media"
                                            className="inline-flex h-11 items-center justify-center px-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all hover:scale-105 gap-2"
                                        >
                                            View Media Library
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </AdminCardContent>
            </AdminCard>
        </div>
    )
}
