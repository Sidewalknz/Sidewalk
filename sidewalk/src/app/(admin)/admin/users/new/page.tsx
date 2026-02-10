import React from 'react'
import UserForm from '@/components/admin/UserForm'
import { createUser } from '@/actions/users'

export default function NewUserPage() {
  return (
    <UserForm
      mode="create"
      action={createUser}
    />
  )
}
