'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Image as ImageIcon, Briefcase, CreditCard, LogOut, Share2 } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { useAdminTheme, ADMIN_THEMES } from './AdminThemeProvider'

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs))
}

export const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Clients', href: '/admin/clients', icon: Briefcase },
  { name: 'Expenses', href: '/admin/ongoing-expenses', icon: CreditCard },
  { name: 'Media', href: '/admin/media', icon: ImageIcon },
  { name: 'Social Media', href: '/admin/social-media', icon: Share2 },
  { name: 'Users', href: '/admin/users', icon: Users },
]

export function Sidebar() {
  const pathname = usePathname()
  const { theme, setTheme } = useAdminTheme()

  return (
    <div className="flex flex-col h-full w-64 border-r transition-colors duration-300"
         style={{ 
           backgroundColor: 'var(--admin-sidebar-bg)', 
           borderColor: 'var(--admin-sidebar-border)' 
         }}>
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tight transition-colors duration-300" 
            style={{ color: 'var(--admin-text)' }}>
          sidewalk<span style={{ color: 'var(--admin-text-muted)' }}>admin</span>
        </h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group",
                isActive 
                  ? "bg-opacity-10" 
                  : "hover:bg-opacity-5"
              )}
              style={{
                backgroundColor: isActive ? 'var(--admin-accent)' : undefined,
                color: isActive ? 'var(--admin-accent-text)' : 'var(--admin-text-muted)'
              }}
            >
              <item.icon 
                className="w-5 h-5 transition-colors duration-300"
                style={{
                  color: isActive ? 'var(--admin-accent-text)' : 'currentColor'
                }} 
              />
              <span className="font-medium lowercase">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t transition-colors duration-300"
           style={{ borderColor: 'var(--admin-sidebar-border)' }}>
        
        <div className="mb-6">
            <p className="text-xs font-semibold lowercase mb-3 px-2" 
               style={{ color: 'var(--admin-text-muted)' }}>
              theme
            </p>
            <div className="flex gap-2 px-2">
                {Object.values(ADMIN_THEMES).map((t) => (
                    <button
                        key={t.name}
                        onClick={() => setTheme(t.name as any)}
                        title={t.label}
                        className={cn(
                            "w-6 h-6 rounded-full border border-zinc-500/20 transition-all hover:scale-110",
                            theme === t.name ? "ring-2 ring-offset-2 ring-offset-transparent ring-zinc-500" : ""
                        )}
                        style={{ backgroundColor: t.color }}
                    />
                ))}
            </div>
        </div>

        <button 
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg transition-colors hover:bg-opacity-5"
          style={{ color: 'var(--admin-text-muted)' }}
          onClick={() => {
            // TODO: Implement logout logic
            window.location.href = '/admin/logout'
          }}
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium lowercase">logout</span>
        </button>
      </div>
    </div>
  )
}
