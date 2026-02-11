import React from 'react'
import { Sidebar } from '../../components/admin/Sidebar'
import { MobileNav } from '../../components/admin/MobileNav'
import { AdminThemeProvider } from '../../components/admin/AdminThemeProvider'
import '../globals.css'
import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Sidewalk Admin Dashboard',
  description: 'Custom admin dashboard for Sidewalk',
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })

  if (!user) {
    redirect('/login')
  }

  return (
    <html lang="en">
      <body>
        <AdminThemeProvider>
            <div className="flex flex-col md:flex-row h-screen font-sans antialiased transition-colors duration-300"
                 style={{ 
                     backgroundColor: 'var(--admin-bg)', 
                     color: 'var(--admin-text)' 
                 }}>
                <MobileNav />
                <aside className="hidden md:block">
                    <Sidebar />
                </aside>
                <main className="flex-1 overflow-auto p-6 md:p-8 pt-24 md:pt-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </AdminThemeProvider>
      </body>
    </html>
  )
}

