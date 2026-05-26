'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Rocket } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SIDEWALK_ASSETS } from '@/lib/sidewalk-assets'

import { frontendNavLinks } from '@/lib/nav-links'

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const pathname = usePathname()

  const logoSrc = SIDEWALK_ASSETS.logo || '/logo.png' // Default filename if manifest is missing/null
  const isActiveLink = (href: string) => (href === '/' ? pathname === href : pathname.startsWith(href))

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={cn(
        'fixed top-0 w-full z-50 py-5 transition-colors duration-300',
        scrolled
          ? 'bg-[#F3ECE3]/85 backdrop-blur-md border-transparent'
          : 'bg-transparent border-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            {!logoError && SIDEWALK_ASSETS.logo ? (
              <img 
                src={logoSrc} 
                alt="Logo" 
                className="h-8 w-auto group-hover:scale-110 transition-transform"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="bg-brand-600 p-1.5 rounded-lg text-white group-hover:scale-110 transition-transform">
                <Rocket size={20} />
              </div>
            )}
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {frontendNavLinks.map((link) => {
              const isActive = isActiveLink(link.href)

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    'text-sm text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-500 transition-colors',
                    isActive ? 'font-black text-slate-900 dark:text-white' : 'font-semibold'
                  )}
                >
                  {link.name}
                </Link>
              )
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:text-brand-600 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      <div
        className={cn(
          'md:hidden absolute w-full bg-[#F3ECE3] transition-all duration-300 ease-in-out overflow-hidden',
          isOpen ? 'max-h-64' : 'max-h-0'
        )}
      >
        <div className="px-4 pt-2 pb-6 space-y-1">
          {frontendNavLinks.map((link) => {
            const isActive = isActiveLink(link.href)

            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'block px-3 py-3 text-base text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-brand-600 rounded-md transition-colors',
                  isActive ? 'font-black text-slate-900 dark:text-white' : 'font-semibold'
                )}
              >
                {link.name}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
