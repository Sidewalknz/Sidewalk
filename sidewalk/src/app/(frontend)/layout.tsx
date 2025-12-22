import React from 'react'
import './styles.css'

export const metadata = {
  description: 'Sidewalk - Web solutions company specializing in Next.js, Payload CMS, and PostgreSQL. Self-hosted, modern web experiences.',
  title: 'Sidewalk - Web Solutions Company',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
