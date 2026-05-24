import React from 'react'
import { notFound } from 'next/navigation'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { getOutgoingById } from '@/actions/outgoings'
import { OutgoingForm } from '@/components/admin/OutgoingForm'

export const dynamic = 'force-dynamic'

export default async function EditOutgoingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const outgoing = await getOutgoingById(id).catch(() => null)
  if (!outgoing) notFound()

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <AdminPageHeader
        title="Edit Outgoing"
        subtitle={outgoing?.name || 'Manage recurring expense'}
        backHref="/admin/outgoings"
        backTitle="Back to Outgoings"
      />

      <OutgoingForm outgoing={outgoing} />
    </div>
  )
}
