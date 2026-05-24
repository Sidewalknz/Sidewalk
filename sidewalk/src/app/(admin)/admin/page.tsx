import React from 'react'
import { CardContent } from '@/components/ui/card'
import { getPayload } from 'payload'
import config from '@payload-config'
import { DashboardGrid } from '@/components/admin/DashboardGrid'
import { ComponentSlot } from '@/components/admin/ComponentSlot'

async function getDashboardStats() {
    const payload = await getPayload({ config })

    const now = new Date()
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

    const [usersCount, mediaCount, currentMonthUsers, lastMonthUsers] = await Promise.all([
        payload.count({ collection: 'users' }),
        payload.count({ collection: 'media' }),
        payload.count({ 
            collection: 'users',
            where: {
                createdAt: {
                    greater_than_equal: currentMonthStart.toISOString()
                }
            }
        }),
        payload.count({
            collection: 'users',
            where: {
                and: [
                    {
                        createdAt: {
                            greater_than_equal: lastMonthStart.toISOString()
                        }
                    },
                    {
                        createdAt: {
                            less_than_equal: lastMonthEnd.toISOString()
                        }
                    }
                ]
            }
        })
    ])

    let userGrowthMessage = "No recent registrations"
    if (lastMonthUsers.totalDocs > 0) {
        const growth = ((currentMonthUsers.totalDocs - lastMonthUsers.totalDocs) / lastMonthUsers.totalDocs) * 100
        userGrowthMessage = `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}% from last month`
    } else if (currentMonthUsers.totalDocs > 0) {
        userGrowthMessage = `${currentMonthUsers.totalDocs} new registrations this month`
    }

    return {
        users: usersCount.totalDocs,
        media: mediaCount.totalDocs,
        userGrowth: userGrowthMessage
    }
}

function StatWidget({ title, value, description }: { title: string, value: string, description: string }) {
    return (
        <CardContent className="p-6">
            <div className="space-y-0">
                <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">{title}</h3>
                <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{value}</div>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-bold pt-3">{description}</p>
            </div>
        </CardContent>
    )
}

export default async function DashboardPage() {
    const stats = await getDashboardStats()

    const widgets = [
        {
            id: 'total-users',
            title: 'Total Users',
            span: 1 as const,
            content: (
                <StatWidget 
                    title="Total Users" 
                    value={stats.users.toString()} 
                    description={stats.userGrowth}
                />
            )
        },
        {
            id: 'media-library',
            title: 'Media Library',
            span: 1 as const,
            content: (
                <StatWidget 
                    title="Media Library" 
                    value={stats.media.toString()} 
                    description="Total visual assets in vault"
                />
            )
        },
    ]

    return (
        <div className="space-y-10 selection:bg-brand-100 selection:text-brand-900 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                   <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-600 mb-1 block">Management Console</span>
                   <h1 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white border-l-8 border-brand-600 pl-6 leading-none">
                     DASHBOARD<span className="text-brand-600">.</span>
                   </h1>
                   <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-lg font-medium">Overview of your platform's operational health and resource metrics.</p>
                </div>
            </div>

            <DashboardGrid storageKey="admin-dashboard-order" widgets={widgets}>
              <ComponentSlot name="admin-dashboard-widgets" />
            </DashboardGrid>
            
            <footer className="mt-20 pt-10 border-t border-slate-200/60 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 dark:text-slate-500 font-medium text-xs uppercase tracking-widest selection:bg-brand-100">
                <div className="flex items-center gap-2">
                    <span>Powered by</span>
                    <span className="text-brand-600 font-black">Sidewalk</span>
                </div>
            </footer>
        </div>
    )
}
