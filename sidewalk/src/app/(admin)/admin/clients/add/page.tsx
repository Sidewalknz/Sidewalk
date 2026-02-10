'use client'

import React from 'react'
import { createClient } from '@/actions/clients'
import ClientForm from '@/components/admin/ClientForm'

export default function AddClientPage() {
  return <ClientForm action={createClient} mode="create" />
}

