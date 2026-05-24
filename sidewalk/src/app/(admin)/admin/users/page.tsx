import React from 'react'
import Link from 'next/link'
import { getUsers, deleteUser } from '@/actions/users'
import { Trash2, Edit, ArrowUpDown, Users, Plus } from 'lucide-react'
import SearchInput from '@/components/admin/SearchInput'
import { cn } from '@/lib/utils'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { AdminActiveFilters } from '@/components/admin/AdminActiveFilters'
import { AdminCard, AdminCardContent } from '@/components/admin/AdminCard'
import { AdminIconButtonLink, AdminIconButton } from '@/components/admin/AdminIconButton'
import { AdminDataTable } from '@/components/admin/AdminDataTable'
import { AdminTopBarIconButtonLink } from '@/components/admin/AdminTopBarIconButton'
import { AdminListFooterBar } from '@/components/admin/AdminListFooterBar'

export default async function UsersPage({
    searchParams,
}: {
    searchParams: Promise<{ search?: string, sort?: string }>
}) {
    const { search, sort } = await searchParams
    const users = await getUsers(search, sort)

    const getSortLink = (field: string) => {
        const nextOrder = sort === field ? `-${field}` : field
        const params = new URLSearchParams()
        if (search) params.set('search', search)
        params.set('sort', nextOrder)
        return `?${params.toString()}`
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AdminPageHeader
                title="Users"
                subtitle="Manage user accounts and access"
                titleClassName="uppercase"
                center={<SearchInput placeholder="Filter by email..." />}
            >
                <AdminTopBarIconButtonLink href="/admin/users/new" title="Add user">
                    <Plus className="w-4 h-4" />
                </AdminTopBarIconButtonLink>
            </AdminPageHeader>

            <AdminActiveFilters
                filters={search ? [{ label: 'Search', value: search }] : []}
                resetHref="/admin/users"
            />
            
            <AdminCard>
                <AdminCardContent>
                    <AdminDataTable
                        data={users}
                        getRowKey={(user: any) => user.id}
                        columns={[
                            {
                                id: 'name',
                                header: (
                                    <Link 
                                        href={getSortLink('firstName')}
                                        className="flex items-center cursor-pointer hover:text-indigo-600 transition-colors"
                                    >
                                        Name <ArrowUpDown className="ml-2 h-3 w-3" />
                                    </Link>
                                ),
                                cell: (user: any) => (
                                    <div>
                                        <p className="font-black text-slate-900 dark:text-white text-base leading-none mb-1 tracking-tight">
                                            {user.firstName} {user.lastName}
                                            {!user.firstName && !user.lastName && 'No name set'}
                                        </p>
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center uppercase font-black tracking-widest">
                                           ID: {user.id}
                                        </p>
                                    </div>
                                ),
                            },
                            {
                                id: 'contact',
                                header: (
                                    <Link 
                                        href={getSortLink('email')}
                                        className="flex items-center cursor-pointer hover:text-indigo-600 transition-colors"
                                    >
                                        Contact <ArrowUpDown className="ml-2 h-3 w-3" />
                                    </Link>
                                ),
                                cell: (user: any) => (
                                    <div>
                                        <p className="font-bold text-slate-700 dark:text-slate-300 text-xs tracking-tight">{user.email}</p>
                                        {user.phone && <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">{user.phone}</p>}
                                    </div>
                                ),
                            },
                            {
                                id: 'role',
                                header: (
                                    <Link 
                                        href={getSortLink('role')}
                                        className="flex items-center cursor-pointer hover:text-indigo-600 transition-colors"
                                    >
                                        Role <ArrowUpDown className="ml-2 h-3 w-3" />
                                    </Link>
                                ),
                                cell: (user: any) => (
                                    <span
                                        className={cn(
                                            'text-sm font-bold tracking-tight',
                                            (() => {
                                                const roles = user.role || user.roles
                                                const role = Array.isArray(roles) ? roles[0] : roles
                                                return role === 'admin'
                                            })()
                                                ? 'text-brand-600'
                                                : 'text-slate-700 dark:text-slate-300',
                                        )}
                                    >
                                        {(() => {
                                            const roles = user.role || user.roles
                                            const role = Array.isArray(roles) ? roles[0] : roles
                                            return role === 'admin'
                                                ? 'Admin'
                                                : role === 'moderator'
                                                    ? 'Moderator'
                                                    : role === 'editor'
                                                        ? 'Editor'
                                                        : 'User'
                                        })()}
                                    </span>
                                ),
                            },
                            {
                                id: 'actions',
                                header: 'Actions',
                                headerClassName: 'text-right',
                                cellClassName: 'text-right',
                                cell: (user: any) => (
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                                        <AdminIconButtonLink
                                            href={`/admin/users/${user.id}`}
                                            title="Edit User"
                                            variant="brand"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </AdminIconButtonLink>
                                        <form action={async () => {
                                            'use server'
                                            await deleteUser(user.id)
                                        }}>
                                            <AdminIconButton
                                                type="submit"
                                                title="Delete User"
                                                variant="danger"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </AdminIconButton>
                                        </form>
                                    </div>
                                ),
                            },
                        ]}
                        emptyState={
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center border-4 border-white shadow-inner">
                                    <Users className="w-8 h-8 text-slate-200" />
                                </div>
                                <div>
                                   <p className="text-slate-400 font-black uppercase tracking-[0.2em] italic">No users yet</p>
                                   <p className="text-xs text-slate-300 font-bold mt-2">Add your first user to get started.</p>
                                </div>
                            </div>
                        }
                    />
                </AdminCardContent>
            </AdminCard>

            <AdminListFooterBar
                label={
                    <>
                        Showing <span className="text-slate-900 dark:text-white">{users.length}</span> users
                    </>
                }
            />
        </div>
    )
}
