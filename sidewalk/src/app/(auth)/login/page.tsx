import { checkHasUsers } from '@/actions/users'
import { redirect } from 'next/navigation'
import LoginForm from './LoginForm'

export const metadata = {
  title: 'Sidewalk Admin Login',
  description: 'Login to Sidewalk Admin',
}

export default async function LoginPage() {
  const hasUsers = await checkHasUsers()

  if (!hasUsers) {
    redirect('/create-first-user')
  }

  return <LoginForm />
}
