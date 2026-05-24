import React from 'react'

export const metadata = {
  title: 'Admin Login',
  description: 'Login to your custom administration panel',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased flex items-center justify-center p-6 selection:bg-indigo-100 selection:text-indigo-900">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        <div className="relative w-full flex justify-center">
            {children}
        </div>
    </div>
  )
}
