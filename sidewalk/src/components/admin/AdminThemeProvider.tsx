'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type AdminTheme = 'cream' | 'red' | 'blue' | 'yellow'

interface AdminThemeContextType {
  theme: AdminTheme
  setTheme: (theme: AdminTheme) => void
}

const AdminThemeContext = createContext<AdminThemeContextType | undefined>(undefined)

export const ADMIN_THEMES: Record<AdminTheme, { name: string; color: string; label: string }> = {
  cream: { name: 'cream', color: '#FCF5EB', label: 'Cream' },
  red: { name: 'red', color: '#CD5037', label: 'Red' },
  blue: { name: 'blue', color: '#212C34', label: 'Blue' },
  yellow: { name: 'yellow', color: '#E5BF55', label: 'Yellow' },
}

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<AdminTheme>('blue')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('sidewalk-admin-theme') as AdminTheme
    if (savedTheme && ADMIN_THEMES[savedTheme]) {
      setThemeState(savedTheme)
    }
    setMounted(true)
  }, [])

  const setTheme = (newTheme: AdminTheme) => {
    setThemeState(newTheme)
    localStorage.setItem('sidewalk-admin-theme', newTheme)
  }

  // Prevent hydration mismatch by rendering nothing until mounted, 
  // or just render children with default to avoid flicker? 
  // Let's render children with a default wrapper to avoid layout shift,
  // but we might get a flash of wrong theme. 
  // For admin, a small flash is acceptable, or we can use a script to set it early.
  // For now, simple effect is fine.

  return (
    <AdminThemeContext.Provider value={{ theme, setTheme }}>
      <div data-admin-theme={mounted ? theme : 'blue'} className="contents">
        {children}
      </div>
    </AdminThemeContext.Provider>
  )
}

export function useAdminTheme() {
  const context = useContext(AdminThemeContext)
  if (context === undefined) {
    throw new Error('useAdminTheme must be used within an AdminThemeProvider')
  }
  return context
}
