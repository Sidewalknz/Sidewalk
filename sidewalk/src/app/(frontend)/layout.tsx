import React from 'react'
import Script from 'next/script'
import './styles.css'

export const metadata = {
  description: 'Sidewalk - Web solutions company specializing in Next.js, Payload CMS, and PostgreSQL. Self-hosted, modern web experiences.',
  title: 'Sidewalk - Web Solutions Company',
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
