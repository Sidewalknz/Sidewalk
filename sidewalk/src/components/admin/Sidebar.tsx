'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  ImageIcon, 
  Settings, 
  LogOut,
  ChevronRight,
} from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { cn } from '@/lib/utils'
import { logout } from '@/actions/users'
import { adminNavSections } from '@/lib/nav-links'

export const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Media', href: '/admin/media', icon: ImageIcon },
  { name: 'Users', href: '/admin/users', icon: Users },
]

interface SidebarProps {
  user?: any
  isAdmin?: boolean
  isStoreOwner?: boolean
  /** Optional filter function to control which nav sections/items are visible */
  filterSections?: (sections: any[]) => any[]
}

export function Sidebar({ user, isAdmin = true, isStoreOwner = false, filterSections }: SidebarProps) {
  const pathname = usePathname()
  
  const userEmail = user?.email || 'admin@payload.com'
  const userName = userEmail.split('@')[0]

  const visibleNavItems = isAdmin ? navItems : [navItems[0]]

  // Whitelist for store owners: they only see specific ecommerce links
  const STORE_OWNER_WHITELIST = [
    '/admin/products',
    '/admin/orders',
    '/admin/product-options',
    '/admin/sales'
  ]

  let visibleSections = (adminNavSections || [])
    .filter((section: any) => section && section.items)
    .map((section: any) => ({
      ...section,
      items: isAdmin
        ? section.items
        : section.items.filter((item: any) => {
            if (item.adminOnly) return false
            if (item.href === '/admin/stores') return false
            
            // If they are a store owner, only show whitelisted links
            if (isStoreOwner) {
              return STORE_OWNER_WHITELIST.includes(item.href)
            }
            
            // Default (for other non-admin roles if any exist)
            return true
          })
    }))
    .filter((section: any) => section.items && section.items.length > 0)

  if (filterSections) {
    visibleSections = filterSections(visibleSections)
  }

  return (
    <div className="hidden md:flex flex-col h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-colors duration-300 print:hidden">
      <div className="p-6 overflow-y-auto flex-1">
        <div className="flex items-center gap-3 mb-10 border-l-4 border-brand-600 pl-4 py-1">
          <h1 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">
            Admin<span className="text-brand-600 pl-1">Panel</span>
          </h1>
        </div>
        
        <div className="space-y-8">
            <nav className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 ml-3">Core Systems</p>
                {visibleNavItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href + '/'))
                    return (
                        <NavItem key={item.href} item={item} isActive={isActive} />
                    )
                })}
            </nav>

          {visibleSections.map((section: any, sectionIdx: number) => (
                <nav key={section.title || sectionIdx} className="space-y-1">
                    {section.title && <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 ml-3">{section.title}</p>}
                    {section.items.filter((item: any) => item && item.href).map((item: any, itemIdx: number) => {
                        const Icon = (LucideIcons as any)[item.icon] || Settings
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                        return (
                            <NavItem key={`${item.href}-${sectionIdx}-${itemIdx}`} item={{ ...item, icon: Icon }} isActive={isActive} />
                        )
                    })}
                </nav>
            ))}
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 transition-all hover:border-brand-600/20 group">
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2">Need Help?</p>
          <div className="space-y-1">
            <a href="https://sidewalks.co.nz" target="_blank" rel="noopener noreferrer" className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Sidewalks.co.nz</a>
            <a href="mailto:admin@sidewalks.co.nz" className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors text-xs truncate">admin@sidewalks.co.nz</a>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
         <Link 
            href="/admin/settings"
            className="flex items-center gap-3 px-4 py-4 mb-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
         >
            <div className="flex-1 overflow-hidden">
               <p className="text-sm font-black text-slate-900 dark:text-white truncate capitalize group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors tracking-tight">{userName}</p>
               <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 truncate uppercase tracking-widest">{userEmail}</p>
            </div>
         </Link>
         
         <form action={logout} className="w-full">
            <button type="submit" className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-slate-500 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-900/10 hover:text-rose-600 dark:hover:text-rose-400 transition-colors font-semibold text-sm group">
              <LogOut className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-rose-500 dark:group-hover:text-rose-400" />
              <span>Logout</span>
            </button>
         </form>
      </div>
    </div>
  )
}

function NavItem({ item, isActive }: { item: any, isActive: boolean }) {
    return (
        <Link
            href={item.href || '#'}
            className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group",
                isActive 
                ? "bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 shadow-sm" 
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
            )}
        >
            <div className="flex items-center gap-3">
                <item.icon className={cn(
                "w-5 h-5 transition-colors",
                isActive ? "text-brand-600 dark:text-brand-400" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                )} />
                <span className="font-semibold text-sm">{item.name}</span>
            </div>
            {isActive && (
                <ChevronRight className="w-4 h-4 text-brand-400" />
            )}
        </Link>
    )
}
