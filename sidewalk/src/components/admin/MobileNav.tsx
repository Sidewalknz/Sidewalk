'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, LogOut } from 'lucide-react'
import { navItems, cn } from './Sidebar'
import { useAdminTheme, ADMIN_THEMES } from './AdminThemeProvider'

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useAdminTheme()

  // Close drawer when pathname changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Prevent scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <div className="md:hidden">
      {/* Header */}
      <header 
        className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-6 z-40 border-b transition-colors duration-300"
        style={{ 
          backgroundColor: 'var(--admin-sidebar-bg)', 
          borderColor: 'var(--admin-sidebar-border)',
          backdropFilter: 'blur(8px)'
        }}
      >
        <Link href="/admin" className="text-xl font-bold tracking-tight">
          sidewalk<span style={{ color: 'var(--admin-text-muted)' }}>admin</span>
        </Link>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg transition-colors"
          style={{ color: 'var(--admin-text)' }}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <aside 
        className={cn(
          "fixed top-0 right-0 bottom-0 w-[280px] z-50 transform transition-transform duration-300 ease-in-out border-l",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        style={{ 
          backgroundColor: 'var(--admin-sidebar-bg)', 
          borderColor: 'var(--admin-sidebar-border)' 
        }}
      >
        <div className="flex flex-col h-full pt-20 pb-6 px-4">
          <nav className="flex-1 space-y-2">
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

          <div className="mt-auto border-t pt-6" style={{ borderColor: 'var(--admin-sidebar-border)' }}>
            <div className="mb-6 px-2">
                <p className="text-xs font-semibold lowercase mb-3" 
                   style={{ color: 'var(--admin-text-muted)' }}>
                  theme
                </p>
                <div className="flex gap-2">
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
                window.location.href = '/admin/logout'
              }}
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium lowercase">logout</span>
            </button>
          </div>
        </div>
      </aside>
    </div>
  )
}
