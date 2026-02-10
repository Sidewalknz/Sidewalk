'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Image as ImageIcon, Briefcase, CreditCard, LogOut } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs))
}

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Clients', href: '/admin/clients', icon: Briefcase },
  { name: 'Expenses', href: '/admin/ongoing-expenses', icon: CreditCard },
  { name: 'Media', href: '/admin/media', icon: ImageIcon },
  { name: 'Users', href: '/admin/users', icon: Users },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full bg-zinc-950 border-r border-zinc-800 w-64">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Sidewalk<span className="text-zinc-500">Admin</span>
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
                  ? "bg-zinc-800 text-white" 
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-blue-500" : "text-zinc-500 group-hover:text-zinc-300")} />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <button 
          className="flex items-center gap-3 px-4 py-3 w-full text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors"
          onClick={() => {
            // TODO: Implement logout logic
            window.location.href = '/admin/logout'
          }}
        >
          <LogOut className="w-5 h-5 text-zinc-500" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  )
}
