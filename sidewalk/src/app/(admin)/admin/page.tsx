import React from 'react'
import { Card } from '@/components/ui/Card'
import { DollarSign, Briefcase, Users, CreditCard, Activity, Calendar } from 'lucide-react'
import { getPayload } from 'payload'
import config from '@payload-config'

async function getDashboardStats() {
    const payload = await getPayload({ config })

    // Fetch Clients (with high limit to get all for stats)
    const clientsData = await payload.find({
        collection: 'clients',
        limit: 1000,
        depth: 1,
    })

    // Fetch Ongoing Expenses
    const expensesData = await payload.find({
        collection: 'ongoing-expenses',
        limit: 1000,
        where: {
            isActive: {
                equals: true,
            },
        },
    })

    // --- Client Metrics ---
    const totalClients = clientsData.totalDocs
    let totalOneOffRevenue = 0
    let totalProducts = 0
    let yearlyRecurringRevenue = 0

    clientsData.docs.forEach((client) => {
        if (client.products) {
            client.products.forEach((product) => {
                totalProducts++
                
                // One-off Revenue
                if (product.price) {
                    totalOneOffRevenue += product.price
                }

                // Recurring Revenue
                if (product.monthlyFee) {
                    yearlyRecurringRevenue += product.monthlyFee * 12
                }
            })
        }
    })

    const averagePerClient = totalClients > 0 ? totalOneOffRevenue / totalClients : 0
    const averagePerJob = totalProducts > 0 ? totalOneOffRevenue / totalProducts : 0

    // --- Expense Metrics (Active Only) ---
    const activeExpensesCount = expensesData.totalDocs
    let yearlyExpenses = 0

    expensesData.docs.forEach((expense) => {
        const amount = expense.amount || 0
        switch (expense.frequency) {
            case 'weekly':
                yearlyExpenses += amount * 52
                break
            case 'monthly':
                yearlyExpenses += amount * 12
                break
            case 'yearly':
                yearlyExpenses += amount
                break
        }
    })

    return {
        clients: {
            total: totalClients,
            totalCost: totalOneOffRevenue,
            averagePerClient,
            averagePerJob,
            totalProducts,
        },
        expenses: {
            activeCount: activeExpensesCount,
            yearly: {
                income: yearlyRecurringRevenue,
                expense: yearlyExpenses,
            },
            monthly: {
                income: yearlyRecurringRevenue / 12,
                expense: yearlyExpenses / 12,
            },
            weekly: {
                income: yearlyRecurringRevenue / 52,
                expense: yearlyExpenses / 52,
            },
        },
    }
}

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(amount)
}

export default async function DashboardPage() {
    const stats = await getDashboardStats()

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-zinc-400 mt-2">Welcome back to the Sidewalk Admin.</p>
            </div>

            {/* Clients Summary */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-zinc-300">Clients Summary</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="p-6 rounded-xl bg-blue-500/5 border border-blue-500/10">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <p className="text-sm font-medium text-zinc-400">Total Clients</p>
                            <Users className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="text-3xl font-bold text-blue-500">{stats.clients.total}</div>
                    </div>
                    
                    <div className="p-6 rounded-xl bg-green-500/5 border border-green-500/10">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <p className="text-sm font-medium text-zinc-400">Total Revenue (One-off)</p>
                            <DollarSign className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="text-3xl font-bold text-green-500">{formatCurrency(stats.clients.totalCost)}</div>
                    </div>

                    <div className="p-6 rounded-xl bg-yellow-500/5 border border-yellow-500/10">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <p className="text-sm font-medium text-zinc-400">Average per Client</p>
                            <Users className="h-4 w-4 text-yellow-500" />
                        </div>
                        <div className="text-3xl font-bold text-yellow-500">{formatCurrency(stats.clients.averagePerClient)}</div>
                    </div>

                    <div className="p-6 rounded-xl bg-pink-500/5 border border-pink-500/10">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <p className="text-sm font-medium text-zinc-400">Average per Job</p>
                            <Briefcase className="h-4 w-4 text-pink-500" />
                        </div>
                        <div className="text-3xl font-bold text-pink-500">{formatCurrency(stats.clients.averagePerJob)}</div>
                        <p className="text-xs text-zinc-500 mt-1">{stats.clients.totalProducts} total products</p>
                    </div>
                </div>
            </div>

             {/* Ongoing Expenses Summary */}
             <div className="space-y-4">
                <h3 className="text-lg font-semibold text-zinc-300">Ongoing Expenses Summary</h3>
                
                <div className="mb-4">
                    <div className="text-3xl font-bold text-blue-500">{stats.expenses.activeCount}</div>
                    <p className="text-sm text-zinc-400">Active Expenses</p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <p className="text-sm font-medium text-blue-400">Weekly (Exp / Inc)</p>
                            <Calendar className="h-4 w-4 text-zinc-500" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-zinc-200">{formatCurrency(stats.expenses.weekly.expense)}</span>
                            <span className="text-zinc-500">/</span>
                            <span className="text-2xl font-bold text-blue-500">{formatCurrency(stats.expenses.weekly.income)}</span>
                        </div>
                    </div>

                    <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
                         <div className="flex items-center justify-between space-y-0 pb-2">
                            <p className="text-sm font-medium text-green-400">Monthly (Exp / Inc)</p>
                            <Calendar className="h-4 w-4 text-zinc-500" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-zinc-200">{formatCurrency(stats.expenses.monthly.expense)}</span>
                            <span className="text-zinc-500">/</span>
                            <span className="text-2xl font-bold text-green-500">{formatCurrency(stats.expenses.monthly.income)}</span>
                        </div>
                    </div>

                    <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
                         <div className="flex items-center justify-between space-y-0 pb-2">
                            <p className="text-sm font-medium text-yellow-400">Yearly (Exp / Inc)</p>
                            <Calendar className="h-4 w-4 text-zinc-500" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-zinc-200">{formatCurrency(stats.expenses.yearly.expense)}</span>
                            <span className="text-zinc-500">/</span>
                            <span className="text-2xl font-bold text-yellow-500">{formatCurrency(stats.expenses.yearly.income)}</span>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    )
}

