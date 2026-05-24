'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronRight, LogOut, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { navItems } from './Sidebar'
import { cn } from '@/lib/utils'
import { logout } from '@/actions/users'
import * as LucideIcons from 'lucide-react'
import { adminNavSections } from '@/lib/nav-links'

interface MobileNavProps {
  user?: any
  isAdmin?: boolean
  isStoreOwner?: boolean
  /** Optional filter function to control which nav sections/items are visible */
  filterSections?: (sections: any[]) => any[]
}

export function MobileNav({ user, isAdmin = true, isStoreOwner = false, filterSections }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const userEmail = user?.email || 'admin@payload.com'
  const userName = userEmail.split('@')[0]

  const toggleMenu = () => setIsOpen(!isOpen)

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
            
            // Default
            return true
          })
    }))
    .filter((section: any) => section.items && section.items.length > 0)

  if (filterSections) {
    visibleSections = filterSections(visibleSections)
  }

  return (
    <div className="md:hidden print:hidden">
      <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-3 border-l-4 border-brand-600 pl-3 py-0.5">
          <h1 className="text-lg font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">
            Admin<span className="text-brand-600 pl-1">Panel</span>
          </h1>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleMenu} className="rounded-xl text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-40 flex animate-in fade-in duration-300">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={toggleMenu} />
          <div className="relative w-72 h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col animate-in slide-in-from-left duration-500 overflow-y-auto">
            <div className="p-6 pt-20">
              <nav className="space-y-8">
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 ml-3">Core</p>
                    {visibleNavItems.map((item) => (
                        <MobileNavItem key={item.href} item={item} pathname={pathname} toggleMenu={toggleMenu} />
                    ))}
                </div>

                {visibleSections.map((section: any, sectionIdx: number) => (
                  <div key={section.title || sectionIdx} className="space-y-1">
                    {section.title && <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 ml-3">{section.title}</p>}
                    {section.items.filter((item: any) => item && item.href).map((item: any, itemIdx: number) => {
                      const Icon = (LucideIcons as any)[item.icon] || Settings
                      return (
                        <MobileNavItem key={`${item.href}-${sectionIdx}-${itemIdx}`} item={{ ...item, icon: Icon }} pathname={pathname} toggleMenu={toggleMenu} />
                      )
                    })}
                  </div>
                ))}
              </nav>
            </div>

            <div className="p-6 mt-auto border-t border-slate-100 dark:border-slate-800 space-y-4">
              <Link href="/admin/settings" onClick={toggleMenu} className="flex items-center gap-3">
                 <div className="flex-1 overflow-hidden text-left">
                    <p className="text-sm font-black text-slate-900 dark:text-white truncate capitalize tracking-tight">{userName}</p>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 truncate uppercase tracking-widest">{userEmail}</p>
                 </div>
              </Link>
              <form action={logout}>
                <button type="submit" className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-rose-500 bg-rose-50 dark:bg-rose-900/10 font-bold text-xs uppercase tracking-widest">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function MobileNavItem({ item, pathname, toggleMenu }: { item: any, pathname: string, toggleMenu: () => void }) {
    const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href + '/'))
    return (
        <Link
            href={item.href || '#'}
            onClick={toggleMenu}
            className={cn(
            "flex items-center justify-between px-4 py-3 rounded-xl transition-all group",
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
            {isActive && <ChevronRight className="w-4 h-4 text-brand-400" />}
        </Link>
    )
}
