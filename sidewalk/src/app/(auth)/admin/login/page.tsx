import React from 'react'
import { checkHasUsers } from '@/actions/users'
import { redirect } from 'next/navigation'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

export const dynamic = 'force-dynamic'

export default async function LoginPage() {
  const hasUsers = await checkHasUsers()

  if (!hasUsers) {
    return <RegisterForm />
  }

  return <LoginForm />
}
