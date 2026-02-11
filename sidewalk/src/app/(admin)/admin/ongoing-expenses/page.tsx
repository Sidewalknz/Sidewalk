import React from 'react'
import Link from 'next/link'
import { Edit } from 'lucide-react'
import { getPayload } from 'payload'
import config from '@payload-config'
import DeleteButton from '@/components/admin/DeleteButton'
import { deleteExpense } from '@/actions/expenses'

export default async function OngoingExpensesPage() {
    const payload = await getPayload({ config })
    const expenses = await payload.find({
        collection: 'ongoing-expenses',
        limit: 100,
        sort: 'nextDueDate', 
    })

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-3xl font-bold tracking-tight">Ongoing Expenses</h2>
                <Link href="/admin/ongoing-expenses/add" 
                      className="w-full sm:w-auto px-4 py-2 rounded transition-colors font-medium text-center"
                      style={{ 
                          backgroundColor: 'var(--admin-text)', 
                          color: 'var(--admin-bg)' 
                      }}>
                    Add Expense
                </Link>
            </div>
            
            {/* Desktop Table View */}
            <div className="hidden md:block rounded-xl border overflow-hidden" 
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
                                            <div className="flex justify-end items-center gap-2">
                                                <Link 
                                                    href={`/admin/ongoing-expenses/${expense.id}`} 
                                                    className="p-2 rounded transition-colors text-[var(--admin-text-muted)]"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <DeleteButton id={expense.id} itemName={expense.name} action={deleteExpense} />
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {expenses.docs.length === 0 ? (
                    <div className="p-8 text-center rounded-xl border italic" 
                         style={{ 
                             borderColor: 'var(--admin-sidebar-border)',
                             backgroundColor: 'var(--admin-sidebar-bg)',
                             color: 'var(--admin-text-muted)'
                         }}>
                        No ongoing expenses found.
                    </div>
                ) : (
                    expenses.docs.map((expense) => {
                        const nextDue = expense.nextDueDate ? new Date(expense.nextDueDate).toLocaleDateString() : 'N/A'
                        
                        return (
                            <div key={expense.id} 
                                 className="p-5 rounded-xl border space-y-4"
                                 style={{ 
                                     borderColor: 'var(--admin-sidebar-border)',
                                     backgroundColor: 'var(--admin-sidebar-bg)'
                                 }}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg flex items-center gap-2" style={{ color: 'var(--admin-text)' }}>
                                            {expense.name}
                                            {!expense.isActive && <span className="text-[10px] px-2 py-0.5 bg-red-500/10 text-red-500 rounded-full">Inactive</span>}
                                        </h3>
                                        <p className="text-sm" style={{ color: 'var(--admin-text-muted)' }}>{expense.category || 'No category'}</p>
                                    </div>
                                    <div className="flex gap-1">
                                        <Link 
                                            href={`/admin/ongoing-expenses/${expense.id}`} 
                                            className="p-2 rounded-lg transition-colors bg-white/5 hover:bg-white/10" 
                                            style={{ color: 'var(--admin-text)' }}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'var(--admin-text-muted)' }}>Amount</p>
                                        <p className="text-sm font-medium" style={{ color: 'var(--admin-text)' }}>${expense.amount}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'var(--admin-text-muted)' }}>Frequency</p>
                                        <p className="text-sm font-medium capitalize" style={{ color: 'var(--admin-text)' }}>{expense.frequency}</p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t flex justify-between items-center" style={{ borderColor: 'var(--admin-sidebar-border)' }}>
                                    <div className="text-xs" style={{ color: 'var(--admin-text-muted)' }}>
                                        Next Due: <span className="font-medium" style={{ color: 'var(--admin-text)' }}>{nextDue}</span>
                                    </div>
                                    <DeleteButton id={expense.id} itemName={expense.name} action={deleteExpense} />
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}

