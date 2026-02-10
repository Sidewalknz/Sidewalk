import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function OngoingExpensesPage() {
    const payload = await getPayload({ config })
    const expenses = await payload.find({
        collection: 'ongoing-expenses',
        limit: 100,
        sort: 'nextDueDate', 
    })

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Ongoing Expenses</h2>
                <Link href="/admin/ongoing-expenses/add" 
                      className="px-4 py-2 rounded transition-colors font-medium"
                      style={{ 
                          backgroundColor: 'var(--admin-text)', 
                          color: 'var(--admin-bg)' 
                      }}>
                    Add Expense
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
                            <th className="px-6 py-4 font-medium">Expense Name</th>
                            <th className="px-6 py-4 font-medium">Amount</th>
                            <th className="px-6 py-4 font-medium">Frequency</th>
                            <th className="px-6 py-4 font-medium">Next Due</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--admin-sidebar-border)]">
                        {expenses.docs.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center" style={{ color: 'var(--admin-text-muted)' }}>
                                    No ongoing expenses found.
                                </td>
                            </tr>
                        ) : (
                            expenses.docs.map((expense) => {
                                const nextDue = expense.nextDueDate ? new Date(expense.nextDueDate).toLocaleDateString() : 'N/A'
                                
                                return (
                                    <tr key={expense.id} className="transition-colors hover:bg-white/5">
                                        <td className="px-6 py-4 font-medium" style={{ color: 'var(--admin-text)' }}>
                                            <div className="flex items-center gap-2">
                                                {expense.name}
                                                {!expense.isActive && <span className="text-xs px-2 py-0.5 bg-red-500/10 text-red-500 rounded-full">Inactive</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4" style={{ color: 'var(--admin-text-muted)' }}>${expense.amount}</td>
                                        <td className="px-6 py-4 capitalize" style={{ color: 'var(--admin-text-muted)' }}>{expense.frequency}</td>
                                        <td className="px-6 py-4" style={{ color: 'var(--admin-text-muted)' }}>{nextDue}</td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={`/admin/ongoing-expenses/${expense.id}`} className="hover:underline text-[var(--admin-text-muted)]">Edit</Link>
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

