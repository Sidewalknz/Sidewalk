import React from 'react'
import UserForm from '@/components/admin/UserForm'
import { updateUser, getUser } from '@/actions/users'
import { redirect } from 'next/navigation'

interface EditUserPageProps {
    params: Promise<{ id: string }>
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = await params
  const user = await getUser(parseInt(id))

  if (!user) {
    redirect('/admin/users')
  }

  return (
    <UserForm
      mode="edit"
      initialData={user}
      action={updateUser}
    />
  )
}
