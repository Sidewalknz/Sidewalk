import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { PortfolioItemForm } from '@/components/admin/PortfolioItemForm'

export const dynamic = 'force-dynamic'

export default async function EditPortfolioItemPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const payload = await getPayload({ config })

  const project = await payload.findByID({ collection: 'PortfolioItems', id, depth: 3 }).catch(() => null)

  if (!project) return notFound()

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <AdminPageHeader
        title="Edit Portfolio Item"
        subtitle={`Editing ${project?.title || 'Portfolio item'}`}
        backHref="/admin/portfolio"
        backTitle="Back to Portfolio"
      />

      <PortfolioItemForm
        project={project}
      />
    </div>
  )
}
