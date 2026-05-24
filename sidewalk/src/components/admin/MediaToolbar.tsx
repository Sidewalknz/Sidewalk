'use client'

import React, { useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, LayoutGrid, List, Plus } from 'lucide-react'
import { useDebouncedCallback } from 'use-debounce'
import { cn } from '@/lib/utils'

interface MediaToolbarProps {
    currentSearch: string
    currentLayout: string
    showUploader: boolean
    onToggleUploader: () => void
}

export default function MediaToolbar({ currentSearch, currentLayout, showUploader, onToggleUploader }: MediaToolbarProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (term) {
            params.set('search', term)
        } else {
            params.delete('search')
        }
        
        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`)
        })
    }, 300)

    const setLayout = (layout: 'grid' | 'list') => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('layout', layout)
        
        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`)
        })
    }

    return (
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-4 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative w-full md:w-96 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-brand-500 transition-colors" />
                <Input 
                    placeholder="Search media assets..." 
                    defaultValue={currentSearch}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-11 h-12 rounded-2xl border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-4 focus:ring-brand-50/50 dark:focus:ring-brand-900/20 transition-all font-medium placeholder:italic text-sm dark:text-white dark:placeholder:text-slate-600"
                />
            </div>

            <div className="flex items-center gap-2">
                <Button
                    onClick={onToggleUploader}
                    className={cn(
                        "h-12 px-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center gap-2 shadow-xl hover:shadow-2xl",
                        showUploader 
                            ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 shadow-none hover:shadow-none" 
                            : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-black dark:hover:bg-slate-100"
                    )}
                >
                    <Plus className={cn("w-4 h-4 transition-transform duration-500", showUploader && "rotate-45")} />
                    {showUploader ? "CLOSE UPLOADER" : "ADD ASSET"}
                </Button>

                <div className="w-px h-8 bg-slate-100 dark:bg-slate-800 mx-2 hidden md:block" />

                <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
                    <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setLayout('grid')}
                        className={cn(
                            "w-10 h-10 rounded-xl transition-all",
                            currentLayout === 'grid' ? "bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                        )}
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setLayout('list')}
                        className={cn(
                            "w-10 h-10 rounded-xl transition-all",
                            currentLayout === 'list' ? "bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                        )}
                    >
                        <List className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
