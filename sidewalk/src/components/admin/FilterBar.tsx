'use client'

import React from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition } from 'react'

interface RoleOption {
    value: string
    label: string
}

const defaultRoles: RoleOption[] = [
    { value: 'all', label: 'All Roles' },
    { value: 'admin', label: 'Admin' },
    { value: 'moderator', label: 'Moderator' },
    { value: 'editor', label: 'Editor' },
    { value: 'user', label: 'User' },
]

interface FilterBarProps {
    /** Configurable role filter options. Defaults to admin/moderator/editor/user. */
    roles?: RoleOption[]
}

export default function FilterBar({ roles = defaultRoles }: FilterBarProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams)
        if (value && value !== 'all') {
            params.set(key, value)
        } else {
            params.delete(key)
        }
        
        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`)
        })
    }

    const currentRole = searchParams.get('role') || 'all'
    const currentStatus = searchParams.get('status') || 'all'

    return (
        <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Role / Rank</label>
                <select 
                    value={currentRole}
                    onChange={(e) => updateFilter('role', e.target.value)}
                    disabled={isPending}
                    className="h-11 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold uppercase tracking-tight dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none min-w-[140px]"
                >
                    {roles.map((role) => (
                        <option key={role.value} value={role.value}>{role.label}</option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Status</label>
                <select 
                    value={currentStatus}
                    onChange={(e) => updateFilter('status', e.target.value)}
                    disabled={isPending}
                    className="h-11 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold uppercase tracking-tight dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none min-w-[140px]"
                >
                    <option value="all">All Status</option>
                    <option value="verified">Verified</option>
                    <option value="pending">Pending</option>
                    <option value="flagged">Flagged</option>
                </select>
            </div>
        </div>
    )
}
