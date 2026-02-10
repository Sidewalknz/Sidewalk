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
                <Link href="/admin/ongoing-expenses/add" className="px-4 py-2 bg-white text-zinc-950 rounded hover:bg-zinc-200 transition-colors font-medium">
                    Add Expense
                </Link>
            </div>
            
            <div className="rounded-xl border border-zinc-800 overflow-hidden bg-zinc-950">
                <table className="w-full text-sm text-left">
                    <thead className="bg-zinc-900/50 text-zinc-400">
                        <tr>
                            <th className="px-6 py-4 font-medium">Expense Name</th>
                            <th className="px-6 py-4 font-medium">Amount</th>
                            <th className="px-6 py-4 font-medium">Frequency</th>
                            <th className="px-6 py-4 font-medium">Next Due</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {expenses.docs.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                                    No ongoing expenses found.
                                </td>
                            </tr>
                        ) : (
                            expenses.docs.map((expense) => {
                                const nextDue = expense.nextDueDate ? new Date(expense.nextDueDate).toLocaleDateString() : 'N/A'
                                
                                return (
                                    <tr key={expense.id} className="hover:bg-zinc-900/50 transition-colors">
                                        <td className="px-6 py-4 font-medium">
                                            <div className="flex items-center gap-2">
                                                {expense.name}
                                                {!expense.isActive && <span className="text-xs px-2 py-0.5 bg-red-500/10 text-red-500 rounded-full">Inactive</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-400">${expense.amount}</td>
                                        <td className="px-6 py-4 text-zinc-400 capitalize">{expense.frequency}</td>
                                        <td className="px-6 py-4 text-zinc-400">{nextDue}</td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={`/admin/ongoing-expenses/${expense.id}`} className="text-zinc-400 hover:text-white">Edit</Link>
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

