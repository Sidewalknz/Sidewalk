import React from 'react'
import '../globals.css'

export const metadata = {
  title: 'Sidewalk Admin Login',
  description: 'Login to Sidewalk Admin',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-zinc-950 text-white font-sans antialiased flex items-center justify-center">
            {children}
        </div>
      </body>
    </html>
  )
}
