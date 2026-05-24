import { Sidebar } from '@/components/admin/Sidebar'
import { MobileNav } from '@/components/admin/MobileNav'
import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Administration dashboard.',
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })

  if (!user) {
    redirect('/admin/login')
  }

  // Robust role check: support 'role' (string/array) and 'roles' (array/string)
  const userRoles = user.role || (user as any).roles || []
  const isAdmin = Array.isArray(userRoles) ? userRoles.includes('admin') : userRoles === 'admin'

  if (!isAdmin) {
    // Standard users are not allowed in the admin area
    redirect('/admin/login?error=Unauthorized')
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-50 dark:bg-slate-950 font-sans antialiased selection:bg-brand-100 selection:text-brand-900 overflow-hidden print:block print:h-auto print:bg-white print:overflow-visible">
      <div className="print:hidden">
        <Sidebar user={user} />
      </div>
      <div className="print:hidden">
        <MobileNav user={user} />
      </div>
      <main className="flex-1 overflow-auto bg-slate-50/50 dark:bg-slate-900/50 print:overflow-visible print:bg-white">
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto animate-in fade-in duration-700 print:p-0 print:max-w-none">
          {children}
        </div>
      </main>
    </div>
  )
}
