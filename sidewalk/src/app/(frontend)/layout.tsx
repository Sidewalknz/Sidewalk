import React from 'react'
import { Navbar } from '@/components/frontend/Navbar'
import { Footer } from '@/components/frontend/Footer'
import { Montserrat } from 'next/font/google'
import '@/styles/globals.css'
import { SIDEWALK_ASSETS } from '@/lib/sidewalk-assets'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '600', '700', '800'],
  display: 'swap',
})

export const metadata = {
  title: {
    default: 'Web Design Nelson | Sidewalk',
    template: '%s | Sidewalk',
  },
  description: 'Sidewalk is a web agency in Nelson NZ for web design, website design, web development, and practical digital systems for local businesses.',
  icons: {
    icon: [
      { url: SIDEWALK_ASSETS.favicon || '/favicon.ico' },
    ],
  },
}

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${montserrat.variable} flex flex-col min-h-screen bg-[#F3ECE3] font-sans`}>
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  )
}
