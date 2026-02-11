import React from 'react'
import Link from 'next/link'
import { Edit, ExternalLink } from 'lucide-react'
import { getPayload } from 'payload'
import config from '@payload-config'
import DeleteButton from '@/components/admin/DeleteButton'
import { deleteClient } from '@/actions/clients'

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
                <Link href="/admin/clients/add" 
                      className="px-4 py-2 rounded transition-colors font-medium"
                      style={{ 
                          backgroundColor: 'var(--admin-text)', 
                          color: 'var(--admin-bg)' 
                      }}>
                    Add Client
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
                            <th className="px-6 py-4 font-medium w-16">Logo</th>
                            <th className="px-6 py-4 font-medium">Company Name</th>
                            <th className="px-6 py-4 font-medium">Owner</th>
                            <th className="px-6 py-4 font-medium">Email</th>
                            <th className="px-6 py-4 font-medium">Website</th>
                            <th className="px-6 py-4 font-medium">Type</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--admin-sidebar-border)]">
                        {clients.docs.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-6 py-8 text-center" style={{ color: 'var(--admin-text-muted)' }}>
                                    No clients found. Click "Add Client" to get started.
                                </td>
                            </tr>
                        ) : (
                            clients.docs.map((client) => {
                                const typeStyles = {
                                    ecommerce: 'bg-green-500/10 text-green-500',
                                    portfolio: 'bg-purple-500/10 text-purple-500',
                                    business: 'bg-blue-500/10 text-blue-500',
                                    blog: 'bg-yellow-500/10 text-yellow-500',
                                    other: 'bg-zinc-500/10 text-zinc-500',
                                }
                                
                                const statusStyles = {
                                    in_progress: 'bg-blue-500/10 text-blue-500',
                                    completed: 'bg-emerald-500/10 text-emerald-500',
                                    in_talks: 'bg-amber-500/10 text-amber-500',
                                    completed_hide: 'bg-zinc-500/10 text-zinc-500',
                                }
                                
                                const typeBadgeClass = typeStyles[client.type as keyof typeof typeStyles] || typeStyles.other
                                const statusBadgeClass = statusStyles[client.status as keyof typeof statusStyles] || statusStyles.completed_hide

                                return (
                                    <tr key={client.id} className="transition-colors hover:bg-white/5">
                                        <td className="px-6 py-4" style={{ borderColor: 'var(--admin-sidebar-border)' }}>
                                            {client.icon ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={client.icon}
                                                    alt={`${client.companyName} logo`}
                                                    className="h-8 w-8 object-contain"
                                                />
                                            ) : (
                                                <div className="h-8 w-8 rounded flex items-center justify-center text-xs"
                                                     style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'var(--admin-text-muted)' }}>
                                                    {client.companyName?.charAt(0) || '?'}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-medium" style={{ borderColor: 'var(--admin-sidebar-border)', color: 'var(--admin-text)' }}>{client.companyName}</td>
                                        <td className="px-6 py-4" style={{ borderColor: 'var(--admin-sidebar-border)', color: 'var(--admin-text-muted)' }}>{client.ownerName}</td>
                                        <td className="px-6 py-4" style={{ borderColor: 'var(--admin-sidebar-border)', color: 'var(--admin-text-muted)' }}>{client.email}</td>
                                        <td className="px-6 py-4" style={{ borderColor: 'var(--admin-sidebar-border)', color: 'var(--admin-text-muted)' }}>
                                            {client.website ? (
                                                <a 
                                                    href={client.website} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 hover:text-[var(--admin-text)] transition-colors"
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                    <span className="truncate max-w-[120px]">
                                                        {client.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                                                    </span>
                                                </a>
                                            ) : (
                                                <span className="text-xs opacity-30">N/A</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4" style={{ borderColor: 'var(--admin-sidebar-border)' }}>
                                            <span className={`px-2 py-1 rounded-full text-xs capitalize ${typeBadgeClass}`}>
                                                {client.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4" style={{ borderColor: 'var(--admin-sidebar-border)' }}>
                                            <span className={`px-2 py-1 rounded-full text-xs capitalize ${statusBadgeClass}`}>
                                                {(client.status || 'unknown').replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right" style={{ borderColor: 'var(--admin-sidebar-border)' }}>
                                            <div className="flex justify-end items-center gap-2">
                                                <Link 
                                                    href={`/admin/clients/${client.id}`} 
                                                    className="p-2 rounded transition-colors" 
                                                    style={{ color: 'var(--admin-text-muted)' }}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <DeleteButton id={client.id} itemName={client.companyName} action={deleteClient} />
                                            </div>
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

