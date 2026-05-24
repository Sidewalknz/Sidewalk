import React from 'react'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { OutgoingForm } from '@/components/admin/OutgoingForm'

export const dynamic = 'force-dynamic'

export default async function NewOutgoingPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <AdminPageHeader
        title="New Outgoing"
        subtitle="Create a recurring expense"
        backHref="/admin/outgoings"
        backTitle="Back to Outgoings"
      />

      <OutgoingForm />
    </div>
  )
}
