import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function ClientsPage() {
    const payload = await getPayload({ config })
    const clients = await payload.find({
        collection: 'clients',
        limit: 100,
    })

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Clients</h2>
                <Link href="/admin/clients/add" className="px-4 py-2 bg-white text-zinc-950 rounded hover:bg-zinc-200 transition-colors font-medium">
                    Add Client
                </Link>
            </div>
            
            <div className="rounded-xl border border-zinc-800 overflow-hidden bg-zinc-950">
                <table className="w-full text-sm text-left">
                    <thead className="bg-zinc-900/50 text-zinc-400">
                        <tr>
                            <th className="px-6 py-4 font-medium w-16">Logo</th>
                            <th className="px-6 py-4 font-medium">Company Name</th>
                            <th className="px-6 py-4 font-medium">Owner</th>
                            <th className="px-6 py-4 font-medium">Type</th>
                            <th className="px-6 py-4 font-medium">Email</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {clients.docs.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                                    No clients found. Click "Add Client" to get started.
                                </td>
                            </tr>
                        ) : (
                            clients.docs.map((client) => {
                                // Default type styles
                                const typeStyles = {
                                    ecommerce: 'bg-green-500/10 text-green-500',
                                    portfolio: 'bg-purple-500/10 text-purple-500',
                                    business: 'bg-blue-500/10 text-blue-500',
                                    blog: 'bg-yellow-500/10 text-yellow-500',
                                    other: 'bg-zinc-500/10 text-zinc-500',
                                }
                                
                                const badgeClass = typeStyles[client.type as keyof typeof typeStyles] || typeStyles.other

                                return (
                                    <tr key={client.id} className="hover:bg-zinc-900/50 transition-colors">
                                        <td className="px-6 py-4">
                                            {client.icon ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={client.icon}
                                                    alt={`${client.companyName} logo`}
                                                    className="h-8 w-8 object-contain"
                                                />
                                            ) : (
                                                <div className="h-8 w-8 rounded bg-zinc-800 flex items-center justify-center text-zinc-500 text-xs">
                                                    {client.companyName?.charAt(0) || '?'}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-medium">{client.companyName}</td>
                                        <td className="px-6 py-4 text-zinc-400">{client.ownerName}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs capitalize ${badgeClass}`}>
                                                {client.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-400">{client.email}</td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={`/admin/clients/${client.id}`} className="text-zinc-400 hover:text-white">Edit</Link>
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

