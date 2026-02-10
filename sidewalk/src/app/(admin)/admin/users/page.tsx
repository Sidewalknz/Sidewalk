import React from 'react'
import Link from 'next/link'
import { getUsers, deleteUser } from '@/actions/users'
import { Trash2, Edit } from 'lucide-react'

export default async function UsersPage() {
    const users = await getUsers()

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Users</h2>
                <Link 
                    href="/admin/users/new"
                    className="px-4 py-2 rounded transition-colors font-medium"
                    style={{ 
                        backgroundColor: 'var(--admin-text)', 
                        color: 'var(--admin-bg)' 
                    }}
                >
                    Add User
                </Link>
            </div>
            
            <div className="rounded-xl border overflow-hidden" 
                 style={{ 
                     borderColor: 'var(--admin-sidebar-border)',
                     backgroundColor: 'var(--admin-sidebar-bg)'
                 }}>
                <table className="w-full text-sm text-left">
                    <thead style={{ backgroundColor: 'rgba(0,0,0,0.2)', color: 'var(--admin-text-muted)' }}>
                        <tr>
                            <th className="px-6 py-4 font-medium">Email</th>
                            <th className="px-6 py-4 font-medium">ID</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--admin-sidebar-border)]">
                        {users.map((user) => (
                            <tr key={user.id} className="transition-colors hover:bg-white/5">
                                <td className="px-6 py-4 font-medium" style={{ color: 'var(--admin-text)' }}>{user.email}</td>
                                <td className="px-6 py-4" style={{ color: 'var(--admin-text-muted)' }}>{user.id}</td>
                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                    <Link 
                                        href={`/admin/users/${user.id}`}
                                        className="p-2 rounded transition-colors"
                                        style={{ color: 'var(--admin-text-muted)' }}
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Link>
                                    <form action={async () => {
                                        'use server'
                                        await deleteUser(user.id)
                                    }}>
                                        <button 
                                            type="submit"
                                            className="p-2 text-[var(--admin-text-muted)] hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-6 py-8 text-center" style={{ color: 'var(--admin-text-muted)' }}>
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
