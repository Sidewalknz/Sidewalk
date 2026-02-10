import React from 'react'
import { Card } from '@/components/ui/Card'
import JobCalculatorWidget from '@/components/admin/JobCalculatorWidget'
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
                <h3 className="text-lg font-semibold" style={{ color: 'var(--admin-text-muted)' }}>Clients Summary</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="p-6 rounded-xl" style={{ backgroundColor: 'var(--admin-sidebar-bg)', border: '1px solid var(--admin-sidebar-border)' }}>
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <p className="text-sm font-medium" style={{ color: 'var(--admin-text-muted)' }}>Total Clients</p>
                            <Users className="h-4 w-4" style={{ color: 'var(--admin-text)' }} />
                        </div>
                        <div className="text-3xl font-bold" style={{ color: 'var(--admin-text)' }}>{stats.clients.total}</div>
                    </div>
                    
                    <div className="p-6 rounded-xl" style={{ backgroundColor: 'var(--admin-sidebar-bg)', border: '1px solid var(--admin-sidebar-border)' }}>
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <p className="text-sm font-medium" style={{ color: 'var(--admin-text-muted)' }}>Total Revenue (One-off)</p>
                            <DollarSign className="h-4 w-4" style={{ color: 'var(--admin-text)' }} />
                        </div>
                        <div className="text-3xl font-bold" style={{ color: 'var(--admin-text)' }}>{formatCurrency(stats.clients.totalCost)}</div>
                    </div>

                    <div className="p-6 rounded-xl" style={{ backgroundColor: 'var(--admin-sidebar-bg)', border: '1px solid var(--admin-sidebar-border)' }}>
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <p className="text-sm font-medium" style={{ color: 'var(--admin-text-muted)' }}>Average per Client</p>
                            <Users className="h-4 w-4" style={{ color: 'var(--admin-text)' }} />
                        </div>
                        <div className="text-3xl font-bold" style={{ color: 'var(--admin-text)' }}>{formatCurrency(stats.clients.averagePerClient)}</div>
                    </div>

                    <div className="p-6 rounded-xl" style={{ backgroundColor: 'var(--admin-sidebar-bg)', border: '1px solid var(--admin-sidebar-border)' }}>
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <p className="text-sm font-medium" style={{ color: 'var(--admin-text-muted)' }}>Average per Job</p>
                            <Briefcase className="h-4 w-4" style={{ color: 'var(--admin-text)' }} />
                        </div>
                        <div className="text-3xl font-bold" style={{ color: 'var(--admin-text)' }}>{formatCurrency(stats.clients.averagePerJob)}</div>
                        <p className="text-xs mt-1" style={{ color: 'var(--admin-text-muted)' }}>{stats.clients.totalProducts} total products</p>
                    </div>
                </div>
            </div>

             {/* Ongoing Expenses Summary */}
             <div className="space-y-4">
                <h3 className="text-lg font-semibold" style={{ color: 'var(--admin-text-muted)' }}>Ongoing Expenses Summary</h3>
                
                <div className="mb-4">
                    <div className="text-3xl font-bold" style={{ color: 'var(--admin-text)' }}>{stats.expenses.activeCount}</div>
                    <p className="text-sm" style={{ color: 'var(--admin-text-muted)' }}>Active Expenses</p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-6 rounded-xl" style={{ backgroundColor: 'var(--admin-sidebar-bg)', border: '1px solid var(--admin-sidebar-border)' }}>
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <p className="text-sm font-medium" style={{ color: 'var(--admin-text-muted)' }}>Weekly (Exp / Inc)</p>
                            <Calendar className="h-4 w-4" style={{ color: 'var(--admin-text)' }} />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold" style={{ color: 'var(--admin-text)' }}>{formatCurrency(stats.expenses.weekly.expense)}</span>
                            <span style={{ color: 'var(--admin-text-muted)' }}>/</span>
                            <span className="text-2xl font-bold" style={{ color: 'var(--admin-text)' }}>{formatCurrency(stats.expenses.weekly.income)}</span>
                        </div>
                    </div>

                    <div className="p-6 rounded-xl" style={{ backgroundColor: 'var(--admin-sidebar-bg)', border: '1px solid var(--admin-sidebar-border)' }}>
                         <div className="flex items-center justify-between space-y-0 pb-2">
                            <p className="text-sm font-medium" style={{ color: 'var(--admin-text-muted)' }}>Monthly (Exp / Inc)</p>
                            <Calendar className="h-4 w-4" style={{ color: 'var(--admin-text)' }} />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold" style={{ color: 'var(--admin-text)' }}>{formatCurrency(stats.expenses.monthly.expense)}</span>
                            <span style={{ color: 'var(--admin-text-muted)' }}>/</span>
                            <span className="text-2xl font-bold" style={{ color: 'var(--admin-text)' }}>{formatCurrency(stats.expenses.monthly.income)}</span>
                        </div>
                    </div>

                    <div className="p-6 rounded-xl" style={{ backgroundColor: 'var(--admin-sidebar-bg)', border: '1px solid var(--admin-sidebar-border)' }}>
                         <div className="flex items-center justify-between space-y-0 pb-2">
                            <p className="text-sm font-medium" style={{ color: 'var(--admin-text-muted)' }}>Yearly (Exp / Inc)</p>
                            <Calendar className="h-4 w-4" style={{ color: 'var(--admin-text)' }} />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold" style={{ color: 'var(--admin-text)' }}>{formatCurrency(stats.expenses.yearly.expense)}</span>
                            <span style={{ color: 'var(--admin-text-muted)' }}>/</span>
                            <span className="text-2xl font-bold" style={{ color: 'var(--admin-text)' }}>{formatCurrency(stats.expenses.yearly.income)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Job Calculator */}
            <JobCalculatorWidget />
            
        </div>
    )
}

