import { checkHasUsers } from '@/actions/users'
import { redirect } from 'next/navigation'
import CreateFirstUserForm from './CreateFirstUserForm'

export const metadata = {
  title: 'Sidewalk Admin Setup',
  description: 'Setup first user for Sidewalk Admin',
}

export default async function CreateFirstUserPage() {
  const hasUsers = await checkHasUsers()

  if (hasUsers) {
    redirect('/admin')
  }

  return <CreateFirstUserForm />
}
