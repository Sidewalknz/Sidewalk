import React from 'react'
import Script from 'next/script'
import './styles.css'

export const metadata = {
  metadataBase: new URL('https://sidewalks.co.nz'),
  title: 'Sidewalk - Modern Web Solutions, Next.js & Payload CMS Experts',
  description: 'Sidewalk - Web solutions company specializing in Next.js, Payload CMS, and PostgreSQL. Self-hosted, modern web experiences that streamline business workflows.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Sidewalk - Modern Web Solutions',
    description: 'Expert Next.js and Payload CMS development. We build self-hosted, scalable web experiences.',
    url: 'https://sidewalks.co.nz',
    siteName: 'Sidewalk',
    images: [
      {
        url: '/logo-w-r.svg', // Using a white logo on red as a placeholder OG image
        width: 1200,
        height: 630,
        alt: 'Sidewalk Logo',
      },
    ],
    locale: 'en_NZ',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sidewalk - Modern Web Solutions',
    description: 'Expert Next.js and Payload CMS development.',
    images: ['/logo-w-r.svg'],
  },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const rybbitSiteId = process.env.RYBBIT_SITE_ID || '5'

  return (
    <html lang="en">
      <body>
        <main>{children}</main>
        <Script
          src="https://analytics.sidewalks.co.nz/api/script.js"
          data-site-id={rybbitSiteId}
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
