import React from 'react'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { PortfolioItemForm } from '@/components/admin/PortfolioItemForm'

export const dynamic = 'force-dynamic'

export default async function NewPortfolioItemPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <AdminPageHeader
        title="New Portfolio Item"
        subtitle="Create a new client work entry"
        backHref="/admin/portfolio"
        backTitle="Back to Portfolio"
      />

      <PortfolioItemForm />
    </div>
  )
}
