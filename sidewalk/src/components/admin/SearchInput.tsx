'use client'

import { Search } from 'lucide-react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition, useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'

export default function SearchInput({ placeholder = "Search..." }: { placeholder?: string }) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()
    
    const [text, setText] = useState(searchParams.get('search')?.toString() || '')
    const [query] = useDebounce(text, 500)

    useEffect(() => {
        const currentSearch = searchParams.get('search') || ''
        if (query === currentSearch) return

        const params = new URLSearchParams(searchParams.toString())
        if (query) {
            params.set('search', query)
        } else {
            params.delete('search')
        }
        
        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`)
        })
    }, [query, pathname, router])

    return (
        <div className="relative group hidden lg:block">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${isPending ? 'text-brand-500 animate-pulse' : 'text-slate-400 dark:text-slate-500 group-focus-within:text-brand-500'}`} />
            <input 
                type="text" 
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={placeholder}
                className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all w-64 shadow-sm dark:shadow-none font-medium dark:text-white dark:placeholder:text-slate-600"
            />
        </div>
    )
}
