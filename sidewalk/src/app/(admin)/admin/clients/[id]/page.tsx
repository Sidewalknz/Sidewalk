import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import ClientForm from '@/components/admin/ClientForm'
import { updateClient } from '@/actions/clients'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditClientPage({ params }: PageProps) {
  const { id } = await params
  const payload = await getPayload({ config })

  let client
  try {
    client = await payload.findByID({
      collection: 'clients',
      id: Number(id),
    })
  } catch (error) {
    notFound()
  }

  if (!client) {
    notFound()
  }

  const updateClientAction = updateClient.bind(null, client.id)

  return <ClientForm initialData={client} action={updateClientAction} mode="edit" />
}
