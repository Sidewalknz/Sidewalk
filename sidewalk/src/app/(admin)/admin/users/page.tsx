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
                    className="px-4 py-2 bg-white text-zinc-950 rounded hover:bg-zinc-200 transition-colors font-medium"
                >
                    Add User
                </Link>
            </div>
            
            <div className="rounded-xl border border-zinc-800 overflow-hidden bg-zinc-950">
                <table className="w-full text-sm text-left">
                    <thead className="bg-zinc-900/50 text-zinc-400">
                        <tr>
                            <th className="px-6 py-4 font-medium">Email</th>
                            <th className="px-6 py-4 font-medium">ID</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-zinc-900/50 transition-colors">
                                <td className="px-6 py-4 font-medium">{user.email}</td>
                                <td className="px-6 py-4 text-zinc-400">{user.id}</td>
                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                    <Link 
                                        href={`/admin/users/${user.id}`}
                                        className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Link>
                                    <form action={async () => {
                                        'use server'
                                        await deleteUser(user.id)
                                    }}>
                                        <button 
                                            type="submit"
                                            className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-6 py-8 text-center text-zinc-500">
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
