import React from 'react'
import { Sidebar } from '../../components/admin/Sidebar'
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
        <div className="flex h-screen bg-zinc-900 text-white font-sans antialiased">
            <aside className="hidden md:block">
                <Sidebar />
            </aside>
            <main className="flex-1 overflow-auto p-8">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
      </body>
    </html>
  )
}

